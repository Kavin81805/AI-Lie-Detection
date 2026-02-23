import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

/**
 * Fact search input
 */
interface FactSearchInput {
  claim: string;
}

/**
 * Related analysis for fact checking
 */
interface RelatedAnalysis {
  id: string;
  verdict: string;
  explanation: string;
  createdAt: Date;
}

/**
 * Fact search result
 */
interface FactSearchOutput {
  relatedAnalyses: RelatedAnalysis[];
  found: boolean;
  matchCount: number;
}

/**
 * Searches fact database (previous analyses) for similar claims.
 * Helps establish patterns and corroborate findings.
 */
@Injectable()
export class FactSearchTool {
  constructor(private prisma: PrismaService) {}

  /**
   * Search for related analyses in database.
   * @param input Claim to search for
   * @returns List of related analyses with verdicts
   */
  async execute(input: FactSearchInput): Promise<FactSearchOutput> {
    const { claim } = input;

    // Extract keywords (words > 4 chars, exclude stop words)
    const keywords = this.extractKeywords(claim);

    if (keywords.length === 0) {
      return {
        relatedAnalyses: [],
        found: false,
        matchCount: 0,
      };
    }

    // Search for each keyword
    const results: Map<string, RelatedAnalysis> = new Map();

    for (const keyword of keywords.slice(0, 3)) {
      try {
        const analyses = await this.prisma.analysis.findMany({
          where: {
            explanation: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          take: 3,
          include: {
            article: {
              select: {
                title: true,
              },
            },
          },
        });

        for (const analysis of analyses) {
          if (!results.has(analysis.id)) {
            results.set(analysis.id, {
              id: analysis.id,
              verdict: analysis.verdict,
              explanation: analysis.explanation,
              createdAt: analysis.createdAt,
            });
          }
        }
      } catch (error) {
        console.error("Error searching fact database:", error);
      }
    }

    const relatedAnalyses = Array.from(results.values()).slice(0, 3);

    return {
      relatedAnalyses,
      found: relatedAnalyses.length > 0,
      matchCount: relatedAnalyses.length,
    };
  }

  /**
   * Extract keywords from text for searching.
   * @param text Text to extract keywords from
   * @returns Array of keywords
   */
  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "is",
      "are",
      "was",
      "be",
    ]);

    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 4 && !stopWords.has(w));

    return [...new Set(words)].slice(0, 5);
  }
}
