/**
 * Person verification data
 */
export interface PersonVerificationData {
  verified: boolean;
  confidence: number;
  officialSources: Array<{
    url: string;
    found: boolean;
  }>;
  verdict: "VERIFIED" | "FABRICATED" | "UNVERIFIED";
  explanation: string;
}

/**
 * Complete vision analysis result combining OCR, LLaVA, and verification
 */
export interface VisionAnalysisResult {
  extractedText: string;
  personDetected: string | null;
  imageType: string;
  ocrConfidence: number;
  personVerification: PersonVerificationData | null;
}
