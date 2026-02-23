import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { VisionService } from "./vision.service";
import { VisionController } from "./vision.controller";
import { ToolsModule } from "../tools/tools.module";

/**
 * Vision module for image analysis and person verification.
 * Integrates Tesseract OCR, LLaVA vision model, and PersonVerifyTool.
 */
@Module({
  imports: [HttpModule, ToolsModule],
  providers: [VisionService],
  controllers: [VisionController],
  exports: [VisionService],
})
export class VisionModule {}
