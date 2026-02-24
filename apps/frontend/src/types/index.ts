/**
 * Article types from backend
 */
export type SourceType = "URL" | "TEXT" | "IMAGE";

export interface Article {
  id: string;
  url?: string;
  text: string;
  title?: string;
  sourceType: SourceType;
  createdAt: string;
  analyses: Analysis[];
}

/**
 * Analysis verdict and results
 */
export type Verdict = "FAKE" | "REAL" | "UNCERTAIN";

export type AnalysisType = "TEXT" | "IMAGE";

export interface ToolCall {
  id: string;
  toolName: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  duration: number;
  success: boolean;
  error?: string;
}

export interface Analysis {
  id: string;
  articleId: string;
  type: AnalysisType;
  verdict: Verdict;
  confidence: number;
  explanation: string;
  toolCalls: ToolCall[];
  createdAt: string;
}

export interface AnalysisStats {
  totalAnalyses: number;
  fakeCount: number;
  realCount: number;
  uncertainCount: number;
  averageConfidence: number;
  mostUsedTool: string;
  recentAnalyses: Analysis[];
}

/**
 * Request DTOs
 */
export interface CreateArticleRequest {
  url?: string;
  text?: string;
  title?: string;
}

export interface AnalyzeTextRequest {
  url?: string;
  text?: string;
}

export interface AnalyzeImageRequest {
  file: File;
  personHint?: string;
}

/**
 * Response types
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface AnalysisResponse {
  data: Analysis;
  articleId: string;
  createdAt: string;
}
