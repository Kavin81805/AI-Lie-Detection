import { Injectable } from "@nestjs/common";

/**
 * Domain credibility score input
 */
interface DomainCredibilityInput {
  url: string;
}

/**
 * Domain credibility analysis result
 */
interface DomainCredibilityOutput {
  domain: string;
  credibilityScore: number;
  classification: "credible" | "suspicious" | "known_fake" | "unknown";
  reason: string;
}

/**
 * Checks domain credibility against known fake/credible domain lists.
 * Scores unknown domains based on TLD and other heuristics.
 */
@Injectable()
export class DomainCredibilityTool {
  private readonly KNOWN_FAKE_DOMAINS = [
    "worldnewsdailyreport.com",
    "empirenews.net",
    "abcnews.com.co",
    "clickhole.com",
    "nationalreport.net",
    "beforeitsnews.com",
    "thespoof.com",
    "huzlers.com",
    "realnewsrightnow.com",
    "newslo.com",
    "superofficialnews.com",
    "freedomcrossroads.us",
    "endingthefed.com",
    "news-hound.com",
    "politicalblindspot.com",
    "activistpost.com",
    "yournewswire.com",
    "newspunch.com",
    "civic-tribune.com",
    "the-observer.com.br",
  ];

  private readonly KNOWN_CREDIBLE_DOMAINS = [
    "reuters.com",
    "apnews.com",
    "bbc.com",
    "bbc.co.uk",
    "npr.org",
    "theguardian.com",
    "nytimes.com",
    "washingtonpost.com",
    "snopes.com",
    "factcheck.org",
    "politifact.com",
    "who.int",
    "cdc.gov",
    "nih.gov",
    "nasa.gov",
    "wikipedia.org",
    "nature.com",
    "science.org",
    "pbs.org",
    "bbc.gov.uk",
  ];

  /**
   * Analyze domain credibility.
   * @param input Domain credibility input with URL
   * @returns Domain analysis with credibility score and classification
   */
  execute(input: DomainCredibilityInput): DomainCredibilityOutput {
    const { url } = input;

    // Extract domain from URL
    let domain: string;
    try {
      const urlObj = new URL(url);
      domain = urlObj.hostname.replace(/^www\./, "");
    } catch {
      return {
        domain: "unknown",
        credibilityScore: 0,
        classification: "unknown",
        reason: "Invalid URL format",
      };
    }

    // Check known fake domains
    if (this.KNOWN_FAKE_DOMAINS.includes(domain)) {
      return {
        domain,
        credibilityScore: 5,
        classification: "known_fake",
        reason: "Domain is in known fake news list",
      };
    }

    // Check known credible domains
    if (this.KNOWN_CREDIBLE_DOMAINS.includes(domain)) {
      return {
        domain,
        credibilityScore: 95,
        classification: "credible",
        reason: "Domain is in known credible sources list",
      };
    }

    // Score unknown domain by TLD
    let score = 50;
    const tld = domain.split(".").pop()?.toLowerCase() || "";

    if (["gov", "edu", "org"].includes(tld)) {
      score += 20;
    } else if (["net", "biz", "xyz", "info"].includes(tld)) {
      score -= 10;
    }

    // Suspicious if domain looks fake
    const suspiciousPatterns =
      /news|breaking|real|truth|expose|alert|urgent|warn/i;
    if (
      suspiciousPatterns.test(domain) &&
      !this.KNOWN_CREDIBLE_DOMAINS.includes(domain)
    ) {
      score -= 15;
    }

    const classification: "credible" | "suspicious" | "unknown" =
      score > 70 ? "credible" : score > 40 ? "suspicious" : "unknown";

    return {
      domain,
      credibilityScore: Math.max(0, Math.min(100, score)),
      classification,
      reason:
        classification === "credible"
          ? "Domain appears to be from a credible source"
          : classification === "suspicious"
            ? "Domain shows characteristics of unreliable source"
            : "Domain credibility is unknown or mixed",
    };
  }
}
