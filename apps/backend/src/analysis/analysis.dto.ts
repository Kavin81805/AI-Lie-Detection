import {
  IsString,
  IsUrl,
  IsOptional,
  MinLength,
  ValidateIf,
} from "class-validator";

/**
 * DTO for analyzing text or URL
 * At least one of text or url must be provided
 */
export class AnalyzeTextDto {
  /**
   * Article URL (optional if text is provided)
   */
  @IsOptional()
  @IsUrl()
  @ValidateIf((obj) => !obj.text)
  url?: string;

  /**
   * Article text content (optional if url is provided)
   */
  @IsOptional()
  @IsString()
  @MinLength(50)
  @ValidateIf((obj) => !obj.url)
  text?: string;
}
