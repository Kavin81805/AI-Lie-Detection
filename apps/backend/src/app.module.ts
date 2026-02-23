import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { ToolsModule } from "./tools/tools.module";
import { VisionModule } from "./vision/vision.module";
import { HealthController } from "./health.controller";

/**
 * Root application module.
 * Initializes all feature modules and global configuration.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../../.env",
    }),
    DatabaseModule,
    ToolsModule,
    VisionModule,
    // Phase 5: AgentModule
    // Phase 6: ArticlesModule, AnalysisModule
  ],
  controllers: [HealthController],
})
export class AppModule {}
