import { Controller, Post, Get, Body, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AnalysisService } from "./analysis.service";
import { AnalyzeTextDto } from "./analysis.dto";

/**
 * Controller for article analysis REST endpoints
 */
@Controller("analysis")
export class AnalysisController {
  constructor(private analysis: AnalysisService) {}

  /**
   * Analyze article text or URL
   * Starts async analysis and returns analysis ID
   * @param dto Article text or URL
   * @returns Analysis ID
   */
  @Post("text")
  @ApiOperation({
    summary: "Analyze article text or URL",
    description:
      "Submit article text or URL for fake news detection analysis",
  })
  @ApiResponse({
    status: 201,
    description: "Analysis started",
    schema: {
      properties: {
        analysisId: { type: "string" },
      },
    },
  })
  async analyzeText(@Body() dto: AnalyzeTextDto) {
    return this.analysis.analyzeText(dto);
  }

  /**
   * Get analysis result by ID
   * @param id Analysis ID
   * @returns Complete analysis with verdict and tool logs
   */
  @Get(":id")
  @ApiOperation({
    summary: "Get analysis result",
    description: "Retrieve full analysis results including verdict and tool calls",
  })
  @ApiResponse({
    status: 200,
    description: "Analysis result found",
  })
  async getAnalysis(@Param("id") id: string) {
    return this.analysis.getAnalysis(id);
  }

  /**
   * Get recent analyses
   * @param limit Number of recent analyses to return
   * @returns List of recent analyses
   */
  @Get()
  @ApiOperation({
    summary: "Get recent analyses",
    description: "Retrieve recent analyses for dashboard",
  })
  @ApiResponse({
    status: 200,
    description: "List of recent analyses",
  })
  async getRecent(@Query("limit") limit: string = "10") {
    const limitNum = Math.min(parseInt(limit) || 10, 100);
    return this.analysis.getRecent(limitNum);
  }

  /**
   * Get analysis statistics
   * @returns Verdict counts
   */
  @Get("stats/summary")
  @ApiOperation({
    summary: "Get analysis statistics",
    description: "Get counts of analyses by verdict",
  })
  @ApiResponse({
    status: 200,
    description: "Analysis statistics",
    schema: {
      properties: {
        total: { type: "number" },
        real: { type: "number" },
        fake: { type: "number" },
        uncertain: { type: "number" },
      },
    },
  })
  async getStats() {
    return this.analysis.getStats();
  }
}
