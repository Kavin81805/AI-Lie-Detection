import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

/**
 * Health check endpoint.
 * Required for Render.com to keep service alive and verify uptime.
 */
@Controller("health")
export class HealthController {
  /**
   * Simple health check endpoint.
   * @returns Health status with timestamp
   */
  @Get()
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({ status: 200, description: "Service is healthy" })
  check(): { status: string; timestamp: string } {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
