import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateArticleDto } from "./articles.dto";

/**
 * Service for article CRUD operations
 */
@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new article
   * @param data Article data
   * @returns Created article
   */
  async create(data: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        url: data.url,
        text: data.text || "",
        title: data.title,
        sourceType: data.url ? "URL" : "TEXT",
      },
    });
  }

  /**
   * Find article by ID
   * @param id Article ID
   * @returns Article with analyses
   */
  async findOne(id: string) {
    return this.prisma.article.findUniqueOrThrow({
      where: { id },
      include: {
        analyses: {
          include: {
            toolCalls: true,
          },
        },
      },
    });
  }

  /**
   * Find all articles with pagination
   * @param limit Number of articles to return
   * @returns List of articles
   */
  async findAll(limit = 10) {
    return this.prisma.article.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        analyses: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }
}
