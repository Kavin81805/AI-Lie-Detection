import { Module } from "@nestjs/common";
import { AgentService } from "./agent.service";
import { ToolExecutorService } from "./tool-executor.service";
import { ToolsModule } from "../tools/tools.module";

/**
 * Agent module for the tool-calling AI agent.
 * Implements custom agent loop orchestration (no LangChain/LangGraph).
 */
@Module({
  imports: [ToolsModule],
  providers: [AgentService, ToolExecutorService],
  exports: [AgentService],
})
export class AgentModule {}
