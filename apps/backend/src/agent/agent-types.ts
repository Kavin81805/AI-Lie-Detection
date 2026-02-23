/**
 * Message format for Ollama chat API
 */
export interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Tool call from LLM
 */
export interface OllamaToolCall {
  function: {
    name: string;
    arguments: Record<string, unknown>;
  };
}

/**
 * Response from Ollama chat API
 */
export interface OllamaResponse {
  message: {
    content: string;
    tool_calls?: OllamaToolCall[];
  };
}

/**
 * Recorded tool call execution
 */
export interface ToolCallRecord {
  toolName: string;
  input: Record<string, unknown>;
  output: unknown;
  durationMs: number;
  success: boolean;
  errorMsg?: string;
}

/**
 * Final agent analysis result
 */
export interface AgentResult {
  verdict: "REAL" | "FAKE" | "UNCERTAIN";
  confidenceScore: number;
  explanation: string;
  toolCallsExecuted: ToolCallRecord[];
  totalProcessingMs: number;
}
