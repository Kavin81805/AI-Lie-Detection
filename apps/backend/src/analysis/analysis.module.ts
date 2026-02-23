import { Module } from "@nestjs/common";
import { AnalysisService } from "./analysis.service";
import { AnalysisController } from "./analysis.controller";
import { ArticlesModule } from "../articles/articles.module";
import { AgentModule } from "../agent/agent.module";

/**
 * Analysis module for fake news detection
 */
@Module({
  imports: [ArticlesModule, AgentModule],
  providers: [AnalysisService],
  controllers: [AnalysisController],
})
export class AnalysisModule {}
