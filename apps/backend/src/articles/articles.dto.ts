import { IsString, IsUrl, IsOptional, MinLength } from "class-validator";

/**
 * DTO for creating an article
 */
export class CreateArticleDto {
  /**
   * Article URL (optional if text is provided)
   */
  @IsOptional()
  @IsUrl()
  url?: string;

  /**
   * Article text content
   */
  @IsOptional()
  @IsString()
  @MinLength(10)
  text?: string;

  /**
   * Article title (optional)
   */
  @IsOptional()
  @IsString()
  title?: string;
}
