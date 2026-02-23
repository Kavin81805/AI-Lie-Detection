import { IsOptional, IsString } from "class-validator";

/**
 * Data transfer object for analyzing images.
 * Contains optional hint for person identification.
 */
export class AnalyzeImageDto {
  /**
   * Optional hint about who is in the image.
   * Used when LLaVA cannot confidently identify the person.
   */
  @IsOptional()
  @IsString()
  personHint?: string;
}
