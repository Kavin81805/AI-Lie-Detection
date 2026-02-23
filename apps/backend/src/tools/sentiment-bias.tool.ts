import { Injectable } from "@nestjs/common";

/**
 * Sentiment and bias analysis input
 */
interface SentimentBiasInput {
  text: string;
}

/**
 * Sentiment and bias analysis result
 */
interface SentimentBiasOutput {
  biasScore: number;
  emotionalTriggers: string[];
  capsRatio: number;
  exclamationCount: number;
  loadedWords: string[];
  verdict: "NEUTRAL" | "BIASED" | "HIGHLY_MANIPULATIVE";
}

/**
 * Analyzes text for emotional language, bias indicators, and manipulative tactics.
 * Detects capitalization, exclamation marks, and emotional trigger words.
 */
@Injectable()
export class SentimentBiasTool {
  private readonly EMOTIONAL_TRIGGERS = [
    "shocking",
    "bombshell",
    "exposed",
    "breaking",
    "urgent",
    "must read",
    "you won't believe",
    "cover up",
    "mainstream media",
    "miracle cure",
    "banned",
    "censored",
    "conspiracy",
    "hoax",
    "silenced",
    "deep state",
    "alert",
    "scandal",
    "massive",
    "unbelievable",
    "incredible",
    "devastating",
    "stunning",
    "horrifying",
    "disgusting",
    "outrageous",
  ];

  /**
   * Analyze sentiment and bias in text.
   * @param input Text to analyze
   * @returns Bias score and emotional analysis
   */
  execute(input: SentimentBiasInput): SentimentBiasOutput {
    const { text } = input;

    // Calculate capitalization ratio
    const lettersCount = (text.match(/[a-z]/gi) || []).length;
    const capsCount = (text.match(/[A-Z]/g) || []).length;
    const capsRatio = lettersCount > 0 ? capsCount / lettersCount : 0;

    // Count exclamation marks
    const exclamationCount = (text.match(/!/g) || []).length;

    // Find emotional trigger words
    const lowerText = text.toLowerCase();
    const emotionalTriggers: string[] = [];
    const triggersFound = new Set<string>();

    for (const trigger of this.EMOTIONAL_TRIGGERS) {
      if (lowerText.includes(trigger) && !triggersFound.has(trigger)) {
        triggersFound.add(trigger);
        emotionalTriggers.push(trigger);
      }
    }

    // Calculate bias score
    let biasScore = 0;

    // Capitalization indicator
    if (capsRatio > 0.3) {
      biasScore += 30;
    } else if (capsRatio > 0.15) {
      biasScore += 15;
    }

    // Exclamation mark indicator
    biasScore += Math.min(exclamationCount * 5, 30);

    // Emotional triggers indicator
    biasScore += Math.min(emotionalTriggers.length * 10, 40);

    // Cap at 100
    biasScore = Math.min(biasScore, 100);

    // Determine verdict
    let verdict: "NEUTRAL" | "BIASED" | "HIGHLY_MANIPULATIVE";
    if (biasScore <= 30) {
      verdict = "NEUTRAL";
    } else if (biasScore <= 60) {
      verdict = "BIASED";
    } else {
      verdict = "HIGHLY_MANIPULATIVE";
    }

    // Find loaded/emotional words
    const loadedWords = emotionalTriggers;

    return {
      biasScore: Math.round(biasScore),
      emotionalTriggers,
      capsRatio: Math.round(capsRatio * 100) / 100,
      exclamationCount,
      loadedWords,
      verdict,
    };
  }
}
