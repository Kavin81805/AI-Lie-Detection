import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * Global NestJS wrapper for PrismaClient.
 * Handles database connection lifecycle.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private isConnected = false;

  /**
   * Called when NestJS module initializes.
   * Establishes database connection.
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.isConnected = true;
      console.log("✅ Database connected via Prisma");
    } catch (error) {
      const isDev = process.env.NODE_ENV === "development";
      if (isDev) {
        console.warn("⚠️  Database connection failed (development mode - continuing anyway)");
        console.error("Error:", error instanceof Error ? error.message : error);
        this.isConnected = false;
      } else {
        throw error;
      }
    }
  }

  /**
   * Gracefully close database connection on application shutdown.
   */
  async onModuleDestroy(): Promise<void> {
    if (this.isConnected) {
      await this.$disconnect();
      console.log("✅ Database disconnected");
    }  }
}