import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

/**
 * Cross reference input
 */
interface CrossReferenceInput {
  headline: string;
}

/**
 * Source information
 */
interface Source {
  title: string;
  verdict: string;
  url?: string;
}

/**
 * Cross reference result
 */
interface CrossReferenceOutput {
  corroborated: boolean;
  sources: Source[];
  contradictions: string[];
  confidence: number;
}

/**
 * Cross-references article headlines against previous analyses.
 * Identifies corroborating and contradicting sources.
 */
@Injectable()
export class CrossReferenceTool {
  constructor(private prisma: PrismaService) {}

  /**
   * Cross-reference headline against existing analyses.
   * @param input Headline to cross-reference
   * @returns Corroboration status and source information
   */
  async execute(input: CrossReferenceInput): Promise<CrossReferenceOutput> {
    const { headline } = input;

    // Extract key nouns from headline
    const keywords = this.extractKeywords(headline);

    if (keywords.length === 0) {
      return {
        corroborated: false,
        sources: [],
        contradictions: [],
        confidence: 0,
      };
    }

    // Search for similar articles
    const sources: Source[] = [];
    const verdictCounts = new Map<string, number>();

    for (const keyword of keywords.slice(0, 5)) {
      try {
        const articles = await this.prisma.article.findMany({
          where: {
            OR: [
              { title: { contains: keyword, mode: "insensitive" } },
              { text: { contains: keyword, mode: "insensitive" } },
            ],
          },
          include: {
            analyses: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
          },
          take: 5,
        });

        for (const article of articles) {
          if (article.analyses.length > 0) {
            const analysis = article.analyses[0];
            sources.push({
              title: article.title || "Untitled",
              verdict: analysis.verdict,
              url: article.url || undefined,
            });

            // Track verdict frequencies
            const count = verdictCounts.get(analysis.verdict) || 0;
            verdictCounts.set(analysis.verdict, count + 1);
          }
        }
      } catch (error) {
        console.error("Error cross-referencing sources:", error);
      }
    }

    // Calculate corroboration
    const uniqueSources = Array.from(
      new Map(sources.map((s) => [s.title, s])).values()
    ).slice(0, 5);

    const totalSources = uniqueSources.length;
    let corroborated = false;
    const contradictions: string[] = [];
    let confidence = 0;

    if (totalSources > 0) {
      const verdictEntries = Array.from(verdictCounts.entries());
      verdictEntries.sort((a, b) => b[1] - a[1]);

      if (verdictEntries.length > 0) {
        const mostCommonVerdict = verdictEntries[0][0];
        const countOfMost = verdictEntries[0][1];

        corroborated = countOfMost > totalSources / 2;
        confidence = Math.round((countOfMost / totalSources) * 100);

        // Find contradictions
        for (const [verdict, count] of verdictEntries.slice(1)) {
          if (verdict !== mostCommonVerdict && count > 0) {
            contradictions.push(`${count} source(s) say ${verdict}`);
          }
        }
      }
    }

    return {
      corroborated,
      sources: uniqueSources,
      contradictions,
      confidence,
    };
  }

  /**
   * Extract keywords from headline.
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
