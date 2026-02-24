import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AgentService } from "../agent/agent.service";
import { AnalyzeTextDto } from "./analysis.dto";
import axios from "axios";

/**
 * Service for article analysis
 */
@Injectable()
export class AnalysisService {
  constructor(
    private prisma: PrismaService,
    private agent: AgentService
  ) {}

  /**
   * Analyze article text or URL
   * @param dto Analysis request with text or URL
   * @returns Analysis object with ID
   */
  async analyzeText(dto: AnalyzeTextDto): Promise<any> {
    if (!dto.text && !dto.url) {
      throw new BadRequestException("Either text or url must be provided");
    }

    let articleText = dto.text || "";

    // Fetch URL if provided
    if (dto.url) {
      console.log(`[ANALYSIS] Fetching URL: ${dto.url}`);
      try {
        const response = await axios.get(dto.url, {
          timeout: 10000,
          maxRedirects: 5,
        });

        // Extract text from HTML (simple approach)
        const html = response.data;
        const textContent = html
          .replace(/<[^>]*>/g, " ") // Remove HTML tags
          .replace(/\s+/g, " ") // Collapse whitespace
          .trim();

        articleText = textContent.slice(0, 3000); // Take first 3000 chars
      } catch (error) {
        console.error("[ANALYSIS] Error fetching URL:", error);
        throw new BadRequestException(
          `Failed to fetch URL: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    // Create article record
    console.log("[ANALYSIS] Creating article record");
    const article = await this.prisma.article.create({
      data: {
        url: dto.url,
        text: articleText,
        title: dto.url || articleText.slice(0, 100),
        sourceType: dto.url ? "URL" : "TEXT",
      },
    });

    // Create analysis record (initial)
    console.log("[ANALYSIS] Creating analysis record");
    const analysis = await this.prisma.analysis.create({
      data: {
        articleId: article.id,
        analysisType: "TEXT",
        verdict: "UNCERTAIN",
        explanation: "Analysis in progress...",
      },
    });

    // Process asynchronously
    console.log(`[ANALYSIS] Starting async analysis for ${analysis.id}`);
    this.processAnalysisAsync(articleText, article.id, analysis.id).catch(
      (error) => {
        console.error("[ANALYSIS] Async processing error:", error);
      }
    );

    // Return full analysis object with id field
    return {
      id: analysis.id,
      articleId: article.id,
      analysisType: analysis.analysisType,
      verdict: analysis.verdict,
      explanation: analysis.explanation,
      createdAt: analysis.createdAt,
    };
  }

  /**
   * Get analysis by ID
   * @param id Analysis ID
   * @returns Complete analysis with results and tool logs
   */
  async getAnalysis(id: string) {
    return this.prisma.analysis.findUniqueOrThrow({
      where: { id },
      include: {
        article: {
          select: {
            id: true,
            url: true,
            title: true,
            text: true,
            sourceType: true,
            createdAt: true,
          },
        },
        toolCalls: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  /**
   * Get recent analyses
   * @param limit Number of analyses to return
   * @returns List of recent analyses
   */
  async getRecent(limit = 10) {
    return this.prisma.analysis.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            url: true,
            sourceType: true,
          },
        },
        toolCalls: true,
      },
    });
  }

  /**
   * Get analysis statistics
   * @returns Counts by verdict
   */
  async getStats() {
    const counts = await this.prisma.analysis.groupBy({
      by: ["verdict"],
      _count: {
        id: true,
      },
    });

    const stats = {
      total: 0,
      real: 0,
      fake: 0,
      uncertain: 0,
    };

    for (const count of counts) {
      stats.total += count._count.id;
      if (count.verdict === "REAL") stats.real = count._count.id;
      else if (count.verdict === "FAKE") stats.fake = count._count.id;
      else if (count.verdict === "UNCERTAIN") stats.uncertain = count._count.id;
    }

    return stats;
  }

  /**
   * Process analysis asynchronously and update database
   * @param articleText Article text to analyze
   * @param articleId Article ID
   * @param analysisId Analysis ID to update
   */
  private async processAnalysisAsync(
    articleText: string,
    articleId: string,
    analysisId: string
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Run agent analysis
      const result = await this.agent.runAnalysis(
        articleText,
        articleId,
        analysisId
      );

      // Update analysis with results
      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: {
          verdict: result.verdict,
          confidenceScore: result.confidenceScore,
          explanation: result.explanation,
          processingMs: result.totalProcessingMs,
        },
      });

      console.log(
        `[ANALYSIS] Completed analysis ${analysisId}: ${result.verdict} (${result.confidenceScore}%)`
      );
    } catch (error) {
      console.error(`[ANALYSIS] Error processing ${analysisId}:`, error);

      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: {
          verdict: "UNCERTAIN",
          explanation:
            error instanceof Error
              ? error.message
              : "Error during analysis",
          processingMs: Date.now() - startTime,
        },
      });
    }
  }

  /**
   * Analyze image with OCR and vision model
   */
  async analyzeImage(file: any, personHint?: string): Promise<any> {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    // Create article record for image
    const article = await this.prisma.article.create({
      data: {
        text: personHint || "Image analysis",
        title: file.originalname || "Image",
        sourceType: "IMAGE",
      },
    });

    // Create initial analysis record
    const analysis = await this.prisma.analysis.create({
      data: {
        articleId: article.id,
        analysisType: "IMAGE_PERSON_VERIFY",
        verdict: "UNCERTAIN",
        explanation: "Image analysis in progress...",
      },
    });

    // Return response
    return {
      id: analysis.id,
      articleId: article.id,
      analysisType: analysis.analysisType,
      verdict: analysis.verdict,
      explanation: analysis.explanation,
      createdAt: analysis.createdAt,
    };
  }
}
