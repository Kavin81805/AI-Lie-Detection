import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./articles.dto";

/**
 * Controller for article management endpoints
 */
@Controller("articles")
export class ArticlesController {
  constructor(private articles: ArticlesService) {}

  /**
   * Create a new article
   * @param dto Article data
   * @returns Created article
   */
  @Post()
  @ApiOperation({ summary: "Create new article" })
  @ApiResponse({
    status: 201,
    description: "Article created",
  })
  async create(@Body() dto: CreateArticleDto) {
    return this.articles.create(dto);
  }

  /**
   * Get article by ID
   * @param id Article ID
   * @returns Article with analyses
   */
  @Get(":id")
  @ApiOperation({ summary: "Get article by ID" })
  @ApiResponse({
    status: 200,
    description: "Article found",
  })
  async findOne(@Param("id") id: string) {
    return this.articles.findOne(id);
  }

  /**
   * List all articles
   * @returns List of articles
   */
  @Get()
  @ApiOperation({ summary: "List all articles" })
  @ApiResponse({
    status: 200,
    description: "List of articles",
  })
  async findAll() {
    return this.articles.findAll();
  }
}
