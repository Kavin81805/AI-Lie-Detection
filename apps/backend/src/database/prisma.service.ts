import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * Global NestJS wrapper for PrismaClient.
 * Handles database connection lifecycle.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Called when NestJS module initializes.
   * Establishes database connection.
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
    console.log("✅ Database connected via Prisma");
  }

  /**
   * Gracefully close database connection on application shutdown.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
