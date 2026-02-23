import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PersonVerifyTool } from "../tools/person-verify.tool";
import { VisionAnalysisResult } from "./vision-result.interface";
import axios from "axios";
import * as Tesseract from "tesseract.js";

/**
 * Vision service for image analysis.
 * Combines OCR (Tesseract.js), LLaVA vision model, and person verification.
 */
@Injectable()
export class VisionService {
  constructor(
    private config: ConfigService,
    private personVerifyTool: PersonVerifyTool
  ) {}

  /**
   * Analyze image using OCR and vision model.
   * Extracts text, identifies person, and verifies statements.
   * @param imageBuffer Image file buffer
   * @param mimeType Image MIME type
   * @param personHint Optional hint about person in image
   * @returns Complete vision analysis result
   */
  async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    personHint?: string
  ): Promise<VisionAnalysisResult> {
    console.log("[VISION] Starting image analysis...");

    // Step 1: Extract text with Tesseract OCR
    console.log("[VISION] Running Tesseract OCR...");
    const ocrResult = await this.extractTextWithOCR(imageBuffer);

    // Step 2: Analyze with LLaVA vision model
    console.log("[VISION] Calling LLaVA vision model...");
    const llavaResult = await this.analyzeWithLLaVA(imageBuffer, mimeType);

    // Determine person name
    const personName =
      llavaResult.personName || personHint || ocrResult.slice(0, 50);

    // Step 3: Verify person statement if we have text and person
    let personVerification = null;
    if (personName && ocrResult.length > 10) {
      console.log(
        `[VISION] Verifying statement for person: ${personName}...`
      );
      try {
        const verificationResult = await this.personVerifyTool.execute({
          personName,
          statement: ocrResult,
        });
        personVerification = verificationResult;
      } catch (error) {
        console.error("[VISION] Person verification error:", error);
      }
    }

    const result: VisionAnalysisResult = {
      extractedText: ocrResult,
      personDetected: personName,
      imageType: llavaResult.imageType || "unknown",
      ocrConfidence: ocrResult.length > 10 ? 85 : 30,
      personVerification,
    };

    console.log("[VISION] Analysis complete");
    return result;
  }

  /**
   * Extract text from image using Tesseract.js OCR.
   * @param imageBuffer Image buffer
   * @returns Extracted text
   */
  private async extractTextWithOCR(imageBuffer: Buffer): Promise<string> {
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageBuffer, "eng");
      return text.trim();
    } catch (error) {
      console.error("[OCR] Tesseract error:", error);
      return "";
    }
  }

  /**
   * Analyze image with LLaVA vision model via Ollama.
   * Identifies person and image type.
   * @param imageBuffer Image buffer
   * @param mimeType Image MIME type
   * @returns LLaVA analysis result
   */
  private async analyzeWithLLaVA(
    imageBuffer: Buffer,
    mimeType: string
  ): Promise<{ personName: string | null; imageType: string; context: string }> {
    try {
      const base64Image = imageBuffer.toString("base64");
      const ollamaBaseUrl = this.config.get<string>(
        "OLLAMA_BASE_URL",
        "http://localhost:11434"
      );
      const visionModel = this.config.get<string>(
        "OLLAMA_VISION_MODEL",
        "llava:7b"
      );

      const prompt = `Analyze this image and provide JSON response with:
1. personName: Who is shown in image? (name or null if unsure)
2. imageType: Type of image (tweet, quote_card, news_clip, video_frame, screenshot, other)
3. context: What text or statement is visible/attributed to them?

Respond ONLY with valid JSON: {"personName": string|null, "imageType": string, "context": string}`;

      const response = await axios.post(
        `${ollamaBaseUrl}/api/chat`,
        {
          model: visionModel,
          messages: [
            {
              role: "user",
              content: prompt,
              images: [base64Image],
            },
          ],
          stream: false,
        },
        { timeout: 30000 }
      );

      const content = response.data.message?.content || "{}";

      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          personName: parsed.personName,
          imageType: parsed.imageType || "unknown",
          context: parsed.context || "",
        };
      }

      return {
        personName: null,
        imageType: "unknown",
        context: "",
      };
    } catch (error) {
      console.error("[LLAVA] Vision model error:", error);
      return {
        personName: null,
        imageType: "unknown",
        context: "",
      };
    }
  }
}
