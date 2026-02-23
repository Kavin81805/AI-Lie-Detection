import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { ToolExecutorService } from "./tool-executor.service";
import { PrismaService } from "../database/prisma.service";
import {
  OllamaMessage,
  OllamaResponse,
  OllamaToolCall,
  AgentResult,
} from "./agent-types";

/**
 * System prompt for the AI agent
 */
const SYSTEM_PROMPT = `You are an expert fake news detection AI. Your job is to analyze articles and determine if they are REAL, FAKE, or UNCERTAIN.

You have access to these tools:
1. check_domain_credibility - Check if the source domain is credible
2. extract_claims - Extract factual claims that can be verified
3. analyze_sentiment_bias - Analyze emotional language and bias indicators
4. search_fact_database - Search previous analyses for similar claims
5. cross_reference_sources - Cross-reference claims against other sources

IMPORTANT RULES:
- You MUST use at least 3 different tools before giving a verdict
- Use tools strategically to gather evidence
- After tool usage, provide ONLY a JSON response with this format:
{"verdict": "REAL" | "FAKE" | "UNCERTAIN", "confidence": 0-100, "explanation": "2-3 sentences"}
- The verdict must be one of exactly: REAL, FAKE, or UNCERTAIN
- Confidence should reflect how certain you are (0-100)
- Explanation should briefly summarize why you reached this verdict`;

/**
 * Tool definitions for Ollama
 */
const OLLAMA_TOOLS = [
  {
    type: "function",
    function: {
      name: "check_domain_credibility",
      description: "Check domain credibility and source trustworthiness",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL to check domain credibility",
          },
        },
        required: ["url"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "extract_claims",
      description:
        "Extract factual claims from text for verification (numbers, dates, statistics)",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text to extract claims from",
          },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyze_sentiment_bias",
      description: "Analyze text for emotional language and bias indicators",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text to analyze for bias",
          },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_fact_database",
      description: "Search previous analyses for similar claims",
      parameters: {
        type: "object",
        properties: {
          claim: {
            type: "string",
            description: "Claim to search for in database",
          },
        },
        required: ["claim"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cross_reference_sources",
      description:
        "Cross-reference claims against other sources and articles",
      parameters: {
        type: "object",
        properties: {
          headline: {
            type: "string",
            description: "Headline to cross-reference",
          },
        },
        required: ["headline"],
      },
    },
  },
];

/**
 * Main agent service that orchestrates tool calling.
 * Implements custom agent loop (no LangChain/LangGraph).
 */
@Injectable()
export class AgentService {
  private readonly MAX_ITERATIONS = 10;

  constructor(
    private toolExecutor: ToolExecutorService,
    private prisma: PrismaService,
    private config: ConfigService
  ) {}

  /**
   * Run analysis on article using tool-calling agent loop.
   * @param articleText Text to analyze
   * @param articleId Article database ID
   * @param analysisId Analysis database ID
   * @returns Agent result with verdict and tool execution logs
   */
  async runAnalysis(
    articleText: string,
    articleId: string,
    analysisId: string
  ): Promise<AgentResult> {
    console.log(`[AGENT] Starting analysis for article ${articleId}`);
    const startTime = Date.now();

    const messages: OllamaMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Please analyze this article for authenticity:\n\n${articleText.slice(0, 3000)}`,
      },
    ];

    let iterations = 0;
    const toolCallsExecuted: Array<any> = [];

    while (iterations < this.MAX_ITERATIONS) {
      iterations++;
      console.log(`[AGENT] Iteration ${iterations}/${this.MAX_ITERATIONS}`);

      try {
        // Call Ollama with tools
        const axiosResponse = await this.callLLM(messages);
        const response = axiosResponse as any;

        // Check if LLM returned tool calls
        if (response.message.tool_calls?.length > 0) {
          // Add assistant message to history
          messages.push({
            role: "assistant",
            content: response.message.content || "",
          });

          // Execute each tool call
          const toolCalls = response.message.tool_calls as OllamaToolCall[];

          for (const toolCall of toolCalls) {
            const { name, arguments: args } = toolCall.function;
            console.log(`[AGENT] Calling tool: ${name}`);

            // Execute tool
            const toolResult = await this.toolExecutor.execute(name, args);
            toolCallsExecuted.push(toolResult);

            // Log to database
            await this.prisma.toolCallLog.create({
              data: {
                analysisId,
                toolName: name,
                input: args as any,
                output: toolResult.output as any,
                durationMs: toolResult.durationMs,
                success: toolResult.success,
                errorMsg: toolResult.errorMsg,
              },
            });

            // Add tool result to messages
            messages.push({
              role: "user",
              content: `Tool ${name} result: ${JSON.stringify(toolResult.output)}`,
            });
          }
        } else {
          // LLM returned final answer (no more tool calls)
          const finalAnswer = this.parseFinalAnswer(response.message.content);

          console.log(
            `[AGENT] Agent completed. Verdict: ${finalAnswer.verdict}, Confidence: ${finalAnswer.confidenceScore}%`
          );

          return {
            ...finalAnswer,
            toolCallsExecuted,
            totalProcessingMs: Date.now() - startTime,
          };
        }
      } catch (error) {
        console.error(`[AGENT] Error in iteration ${iterations}:`, error);
        return {
          verdict: "UNCERTAIN",
          confidenceScore: 20,
          explanation: `Error during analysis: ${error instanceof Error ? error.message : "Unknown error"}`,
          toolCallsExecuted,
          totalProcessingMs: Date.now() - startTime,
        };
      }
    }

    console.warn(
      `[AGENT] Reached max iterations (${this.MAX_ITERATIONS}) without final answer`
    );

    return {
      verdict: "UNCERTAIN",
      confidenceScore: 30,
      explanation:
        "Analysis incomplete - agent reached max iterations. Unable to determine authenticity with confidence.",
      toolCallsExecuted,
      totalProcessingMs: Date.now() - startTime,
    };
  }

  /**
   * Call Ollama LLM with tool definitions.
   * @param messages Conversation history
   * @returns Ollama API response
   */
  private async callLLM(messages: OllamaMessage[]): Promise<any> {
    const ollamaBaseUrl = this.config.get<string>(
      "OLLAMA_BASE_URL",
      "http://localhost:11434"
    );
    const textModel = this.config.get<string>(
      "OLLAMA_TEXT_MODEL",
      "qwen2.5-coder:7b"
    );

    console.log(`[AGENT] Calling ${textModel} on ${ollamaBaseUrl}`);

    const response = await axios.post(
      `${ollamaBaseUrl}/api/chat`,
      {
        model: textModel,
        messages,
        tools: OLLAMA_TOOLS,
        stream: false,
      },
      { timeout: 60000 }
    );

    return response.data;
  }

  /**
   * Parse final answer from LLM response.
   * Tries multiple strategies to extract verdict, confidence, and explanation.
   * @param content LLM response content
   * @returns Parsed agent result
   */
  private parseFinalAnswer(content: string): {
    verdict: "REAL" | "FAKE" | "UNCERTAIN";
    confidenceScore: number;
    explanation: string;
  } {
    console.log("[AGENT] Parsing final answer...");

    // Strategy 1: Direct JSON parsing
    try {
      const json = JSON.parse(content.trim());
      if (this.isValidVerdict(json.verdict)) {
        return {
          verdict: json.verdict as "REAL" | "FAKE" | "UNCERTAIN",
          confidenceScore: Math.max(0, Math.min(100, json.confidence || 50)),
          explanation: String(json.explanation || "Analysis complete"),
        };
      }
    } catch {
      // Continue to next strategy
    }

    // Strategy 2: Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const json = JSON.parse(jsonMatch[0]);
        if (this.isValidVerdict(json.verdict)) {
          return {
            verdict: json.verdict as "REAL" | "FAKE" | "UNCERTAIN",
            confidenceScore: Math.max(0, Math.min(100, json.confidence || 50)),
            explanation: String(json.explanation || "Analysis complete"),
          };
        }
      } catch {
        // Continue to next strategy
      }
    }

    // Strategy 3: Keyword scanning
    const upperContent = content.toUpperCase();
    let verdict: "REAL" | "FAKE" | "UNCERTAIN" = "UNCERTAIN";
    let confidence = 50;

    if (upperContent.includes("FAKE")) {
      verdict = "FAKE";
      confidence = 70;
    } else if (upperContent.includes("REAL")) {
      verdict = "REAL";
      confidence = 70;
    }

    return {
      verdict,
      confidenceScore: confidence,
      explanation: content.slice(0, 300),
    };
  }

  /**
   * Check if string is valid verdict.
   * @param verdict Verdict to check
   * @returns True if valid verdict
   */
  private isValidVerdict(verdict: unknown): boolean {
    return ["REAL", "FAKE", "UNCERTAIN"].includes(String(verdict).toUpperCase());
  }
}
