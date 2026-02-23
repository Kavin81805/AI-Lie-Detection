import { Injectable } from "@nestjs/common";

/**
 * Claim extraction input
 */
interface ClaimExtractorInput {
  text: string;
}

/**
 * Claim extraction result
 */
interface ClaimExtractorOutput {
  claims: string[];
  claimCount: number;
  keyEntities: string[];
}

/**
 * Extracts factual claims from text for verification.
 * Identifies sentences with numbers, dates, statistics, and quoted statements.
 */
@Injectable()
export class ClaimExtractorTool {
  private readonly STOP_WORDS = new Set([
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
    "been",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
  ]);

  /**
   * Extract claims from text.
   * @param input Text to analyze
   * @returns List of extracted claims and key entities
   */
  execute(input: ClaimExtractorInput): ClaimExtractorOutput {
    const { text } = input;

    // Split into sentences
    const sentences = text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    // Filter claims with factual indicators
    const claims: string[] = [];
    const claimSet = new Set<string>();

    for (const sentence of sentences) {
      const hasNumbers = /\d+(\.\d+)?%?/.test(sentence);
      const hasYears = /\b(19|20)\d{2}\b/.test(sentence);
      const hasStatisticalWords =
        /according to|study|percent|million|billion|thousand|research|found|showed|reported/i.test(
          sentence
        );
      const hasQuotes = /["']/.test(sentence);

      if (hasNumbers || hasYears || hasStatisticalWords || hasQuotes) {
        const cleaned = sentence.trim();
        if (cleaned.length > 15 && !claimSet.has(cleaned)) {
          claimSet.add(cleaned);
          claims.push(cleaned);
        }
      }
    }

    // Extract key entities (consecutive capitalized words)
    const entities = new Set<string>();
    const words = text.split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      if (/^[A-Z][a-z]+/.test(words[i])) {
        let entity = words[i];
        // Look ahead for more capitalized words
        for (let j = i + 1; j < Math.min(i + 4, words.length); j++) {
          if (/^[A-Z][a-z]+/.test(words[j])) {
            entity += " " + words[j];
          } else {
            break;
          }
        }
        if (entity.length > 3) {
          entities.add(entity);
        }
      }
    }

    return {
      claims: claims.slice(0, 8),
      claimCount: claims.length,
      keyEntities: Array.from(entities).slice(0, 10),
    };
  }
}
