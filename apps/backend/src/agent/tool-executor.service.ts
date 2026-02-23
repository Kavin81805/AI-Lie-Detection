import { Injectable } from "@nestjs/common";
import { DomainCredibilityTool } from "../tools/domain-credibility.tool";
import { ClaimExtractorTool } from "../tools/claim-extractor.tool";
import { SentimentBiasTool } from "../tools/sentiment-bias.tool";
import { FactSearchTool } from "../tools/fact-search.tool";
import { CrossReferenceTool } from "../tools/cross-reference.tool";
import { ToolCallRecord } from "./agent-types";

/**
 * Executes individual tool calls from agent loop.
 * Routes to appropriate tool service and handles errors.
 */
@Injectable()
export class ToolExecutorService {
  constructor(
    private domainCredibility: DomainCredibilityTool,
    private claimExtractor: ClaimExtractorTool,
    private sentimentBias: SentimentBiasTool,
    private factSearch: FactSearchTool,
    private crossReference: CrossReferenceTool
  ) {}

  /**
   * Execute a tool by name with given input.
   * @param toolName Name of tool to execute
   * @param input Tool input parameters
   * @returns Tool execution result with timing
   */
  async execute(
    toolName: string,
    input: Record<string, unknown>
  ): Promise<ToolCallRecord> {
    const startTime = Date.now();
    let output: unknown;
    let success = true;
    let errorMsg: string | undefined;

    try {
      console.log(`[EXECUTOR] Executing tool: ${toolName}`);

      switch (toolName) {
        case "check_domain_credibility":
          output = this.domainCredibility.execute(
            input as { url: string }
          );
          break;

        case "extract_claims":
          output = this.claimExtractor.execute(input as { text: string });
          break;

        case "analyze_sentiment_bias":
          output = this.sentimentBias.execute(input as { text: string });
          break;

        case "search_fact_database":
          output = await this.factSearch.execute(input as { claim: string });
          break;

        case "cross_reference_sources":
          output = await this.crossReference.execute(
            input as { headline: string }
          );
          break;

        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }

      console.log(`[EXECUTOR] Tool ${toolName} succeeded`);
    } catch (error) {
      success = false;
      errorMsg = error instanceof Error ? error.message : "Unknown error";
      output = null;
      console.error(`[EXECUTOR] Tool ${toolName} failed:`, errorMsg);
    }

    const durationMs = Date.now() - startTime;

    return {
      toolName,
      input,
      output,
      durationMs,
      success,
      errorMsg,
    };
  }
}
