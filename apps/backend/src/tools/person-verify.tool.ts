import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { catchError } from "rxjs/operators";

/**
 * Person verification input
 */
interface PersonVerifyInput {
  personName: string;
  statement: string;
  context?: string;
}

/**
 * Official source check
 */
interface OfficialSource {
  url: string;
  found: boolean;
}

/**
 * Person verification result
 */
interface PersonVerifyOutput {
  verified: boolean;
  confidence: number;
  officialSources: OfficialSource[];
  verdict: "VERIFIED" | "FABRICATED" | "UNVERIFIED";
  explanation: string;
}

/**
 * Verifies person statements against official sources.
 * Searches official websites, government pages, and verified sources.
 */
@Injectable()
export class PersonVerifyTool {
  private readonly OFFICIAL_SOURCES = new Map<string, string[]>([
    ["WHO", ["who.int/news", "who.int/director-general/speeches"]],
    ["CDC", ["cdc.gov/media/releases", "cdc.gov/newsroom"]],
    ["Narendra Modi", ["pmindia.gov.in", "narendramodi.in"]],
    ["Joe Biden", ["whitehouse.gov/briefing-room"]],
    ["Elon Musk", ["twitter.com/elonmusk", "tesla.com/news"]],
    ["Donald Trump", ["truthsocial.com"]],
  ]);

  constructor(private http: HttpService) {}

  /**
   * Verify person statement against official sources.
   * @param input Person name, statement, and optional context
   * @returns Verification result with confidence and sources checked
   */
  async execute(input: PersonVerifyInput): Promise<PersonVerifyOutput> {
    const { personName, statement } = input;

    // Extract keywords from statement
    const keywords = this.extractKeywords(statement);

    // Get official sources for person
    let sources = this.OFFICIAL_SOURCES.get(personName) || [
      `wikipedia.org/wiki/${personName.replace(/\s+/g, "_")}`,
    ];

    const officialSources: OfficialSource[] = [];
    let foundOnOfficial = false;

    // Check each official source
    for (const source of sources.slice(0, 3)) {
      try {
        const url =
          source.startsWith("http") || source.startsWith("www")
            ? source
            : `https://${source}`;

        const response = await this.safeHttpGet(url);
        const found = response
          ? keywords.some((kw) =>
              response.toLowerCase().includes(kw.toLowerCase())
            )
          : false;

        officialSources.push({ url, found });

        if (found) {
          foundOnOfficial = true;
        }

        // Respectful delay between requests
        await this.delay(1000);
      } catch (error) {
        officialSources.push({ url: source, found: false });
      }
    }

    // Determine verdict
    let verdict: "VERIFIED" | "FABRICATED" | "UNVERIFIED";
    let confidence: number;
    let explanation: string;

    if (foundOnOfficial) {
      verdict = "VERIFIED";
      confidence = 90;
      explanation = `Statement verified on official sources for ${personName}`;
    } else if (officialSources.length > 0) {
      verdict = "UNVERIFIED";
      confidence = 20;
      explanation = `Statement not found on official sources for ${personName}. Not necessarily false, just unverified.`;
    } else {
      verdict = "UNVERIFIED";
      confidence = 10;
      explanation = `Unable to verify against official sources for ${personName}`;
    }

    return {
      verified: verdict === "VERIFIED",
      confidence,
      officialSources,
      verdict,
      explanation,
    };
  }

  /**
   * Extract keywords from statement.
   * @param text Statement text
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
      .filter((w) => w.length > 3 && !stopWords.has(w));

    return [...new Set(words)].slice(0, 5);
  }

  /**
   * Safe HTTP GET with error handling.
   * @param url URL to fetch
   * @returns Page content or null on error
   */
  private async safeHttpGet(url: string): Promise<string | null> {
    try {
      const response = await firstValueFrom(
        this.http.get(url, { timeout: 5000 }).pipe(
          catchError(() => {
            return Promise.resolve(null);
          })
        )
      );

      return response?.data ? String(response.data).slice(0, 5000) : null;
    } catch {
      return null;
    }
  }

  /**
   * Delay helper.
   * @param ms Milliseconds to delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
