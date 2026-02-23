import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { DomainCredibilityTool } from "./domain-credibility.tool";
import { ClaimExtractorTool } from "./claim-extractor.tool";
import { SentimentBiasTool } from "./sentiment-bias.tool";
import { FactSearchTool } from "./fact-search.tool";
import { CrossReferenceTool } from "./cross-reference.tool";
import { PersonVerifyTool } from "./person-verify.tool";

/**
 * Tools module that exports all injectable tool services.
 * Each tool implements a specific analysis function for the agent loop.
 */
@Module({
  imports: [HttpModule],
  providers: [
    DomainCredibilityTool,
    ClaimExtractorTool,
    SentimentBiasTool,
    FactSearchTool,
    CrossReferenceTool,
    PersonVerifyTool,
  ],
  exports: [
    DomainCredibilityTool,
    ClaimExtractorTool,
    SentimentBiasTool,
    FactSearchTool,
    CrossReferenceTool,
    PersonVerifyTool,
  ],
})
export class ToolsModule {}
