import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse, ApiConsumes } from "@nestjs/swagger";
import { Verdict } from "@prisma/client";
import { VisionService } from "./vision.service";
import { PrismaService } from "../database/prisma.service";
import { AnalyzeImageDto } from "./vision.dto";

/**
 * Vision API controller for image analysis endpoints.
 * Handles image uploads and person verification.
 */
@Controller("analysis")
export class VisionController {
  constructor(
    private vision: VisionService,
    private prisma: PrismaService
  ) {}

  /**
   * Analyze uploaded image for person and statement verification.
   * Performs OCR, LLaVA vision analysis, and official source verification.
   * @param file Uploaded image file
   * @param dto Analysis options with optional person hint
   * @returns Analysis ID for retrieving results
   */
  @Post("image")
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({ summary: "Analyze image for person verification" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 201,
    description: "Image analysis started",
    schema: { properties: { analysisId: { type: "string" } } },
  })
  async analyzeImage(
    @UploadedFile() file: Express.Multer.File,
    // Note: DTO validation would be applied via ValidationPipe
  ): Promise<{ analysisId: string }> {
    if (!file) {
      throw new BadRequestException("Image file is required");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("File must be an image");
    }

    try {
      console.log(
        `[CONTROLLER] Analyzing image: ${file.originalname} (${file.size} bytes)`
      );

      // Create article record
      const article = await this.prisma.article.create({
        data: {
          text: `Image: ${file.originalname}`,
          title: file.originalname,
          sourceType: "IMAGE",
        },
      });

      // Create analysis record (initial)
      const analysis = await this.prisma.analysis.create({
        data: {
          articleId: article.id,
          analysisType: "IMAGE_PERSON_VERIFY",
          verdict: "UNCERTAIN",
          explanation: "Processing image...",
        },
      });

      // Process image asynchronously and update analysis
      this.processImageAsync(file.buffer, file.mimetype, analysis.id).catch(
        (error) => {
          console.error("[CONTROLLER] Image processing error:", error);
        }
      );

      return { analysisId: analysis.id };
    } catch (error) {
      console.error("[CONTROLLER] Image analysis error:", error);
      throw new InternalServerErrorException("Failed to analyze image");
    }
  }

  /**
   * Process image asynchronously and update analysis record.
   * @param imageBuffer Image file buffer
   * @param mimeType Image MIME type
   * @param analysisId Analysis ID to update
   */
  private async processImageAsync(
    imageBuffer: Buffer,
    mimeType: string,
    analysisId: string
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Analyze image
      const visionResult = await this.vision.analyzeImage(
        imageBuffer,
        mimeType
      );

      // Determine verdict based on verification
      let verdict: Verdict = Verdict.UNCERTAIN;
      let explanation = "Image analyzed";

      if (visionResult.personVerification) {
        const pv = visionResult.personVerification;
        verdict = pv.verdict as Verdict;
        explanation = pv.explanation;
      }

      // Update analysis with results
      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: {
          verdict,
          explanation,
          personDetected: visionResult.personDetected,
          personVerified: visionResult.personVerification?.verified || false,
          officialSources: visionResult.personVerification?.officialSources,
          processingMs: Date.now() - startTime,
        },
      });

      console.log(`[CONTROLLER] Analysis ${analysisId} completed`);
    } catch (error) {
      console.error(`[CONTROLLER] Error processing image ${analysisId}:`, error);

      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: {
          verdict: Verdict.UNCERTAIN,
          explanation: "Error processing image",
          processingMs: Date.now() - startTime,
        },
      });
    }
  }
}
