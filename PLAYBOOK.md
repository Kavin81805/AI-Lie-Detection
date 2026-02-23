# 🔍 AI-Lie-Detection

> **Hackathon Build Playbook — Complete Vibe Coding Prompt Guide**
> Fake News Detection + Authoritative Person Verification via AI Tool-Calling Agent

**Stack:** React · TypeScript · NestJS · PostgreSQL · Supabase · Ollama · LLaVA Vision  
**GitHub:** `AI-Lie-detection` | **Deadline: Thursday**

---

## 📌 What is AI-Lie-Detection?

A SaaS fake news detector with **two unique capabilities**:

**CAPABILITY 1 — TEXT ANALYSIS**  
User pastes article text or a URL. Our NestJS tool-calling agent runs 5 tools in a loop (domain credibility check, claim extraction, sentiment/bias analysis, fact database search, cross-reference sources). The LLM synthesizes all tool results and returns a verdict: `FAKE` / `REAL` / `UNCERTAIN` with a confidence score and explanation.

**CAPABILITY 2 — AUTHORITATIVE PERSON VERIFICATION**  
User uploads an image (screenshot of a tweet, quote card, news clip, video frame). Our vision pipeline:
1. Runs Tesseract OCR to extract visible text
2. Sends the image to LLaVA vision model to identify the person
3. Runs `PersonVerifyTool` to search that person's official websites and verified public pages
4. Returns `VERIFIED` / `FABRICATED` / `UNVERIFIED` with evidence links

> ⚠️ **Hackathon Differentiator:** No LangChain. No LangGraph. No agent frameworks. Our agent loop is 100% custom TypeScript in NestJS. We wrote every line of the orchestration logic.

---

## 🛠️ Full Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend UI — article submission, image upload, results dashboard |
| TypeScript (strict) | Used everywhere — frontend and backend — zero `any` types |
| NestJS + Express | Backend framework — tool-calling agent server |
| PostgreSQL | Primary database via Supabase free tier (500MB) |
| Prisma ORM | Type-safe database access — auto-generated from schema |
| Ollama `qwen2.5-coder:7b` | Local LLM with native tool calling support (text analysis) |
| Ollama `llava:7b` | Vision model — identifies people and reads image content |
| Tesseract.js | OCR — extracts text from images, runs in Node, fully free |
| Axios + `@nestjs/axios` | HTTP client for scraping official pages in PersonVerifyTool |
| Vercel (free) | Frontend hosting — auto deploys on git push |
| Render (free) | Backend hosting — Node web service free tier |
| Supabase (free) | PostgreSQL hosting + optional auth |
| Groq (free tier) | Production LLM fallback — used when deploying (Ollama can't run on Render) |

---

## 📁 Project Folder Structure

```
AI-Lie-detection/
├── apps/
│   ├── backend/src/
│   │   ├── agent/         ← agent loop + tool executor
│   │   ├── tools/         ← 6 injectable tool services
│   │   ├── vision/        ← image OCR + LLaVA + person verify
│   │   ├── analysis/      ← REST API controller + service
│   │   ├── articles/      ← article CRUD
│   │   └── database/      ← PrismaService + DatabaseModule
│   └── frontend/src/
│       ├── components/    ← reusable UI
│       ├── pages/         ← route-level pages
│       ├── services/      ← API call functions
│       └── types/         ← TypeScript interfaces
├── prisma/
│   └── schema.prisma
└── .env
```

---

## 🧠 MASTER PROMPT — Paste at Start of Every Cline Session

> Open VS Code → Cline sidebar → New conversation → Paste this block **FIRST**. Do this every time you start a fresh Cline session.

```
You are building "AI-Lie-Detection", a SaaS fake news detector for a hackathon.
Deadline: Thursday. Move fast. Prioritize working code over perfection.

REPO: github.com/[YOUR_ORG]/AI-Lie-detection

TECH STACK:
  Frontend  : React 18 + TypeScript + Vite + TailwindCSS + React Query
  Backend   : NestJS + TypeScript (Node 20) running on port 3001
  Database  : PostgreSQL via Supabase + Prisma ORM
  LLM Text  : Ollama -> qwen2.5-coder:7b (supports tool calling)
  LLM Vision: Ollama -> llava:7b (image analysis + person ID)
  OCR       : tesseract.js (Node library, no API needed)
  Hosting   : Vercel (frontend) + Render (backend) + Supabase (DB)

PROJECT FOLDER STRUCTURE:
  AI-Lie-detection/
  |-- apps/
  |   |-- backend/src/
  |   |   |-- agent/       <- agent loop + tool executor
  |   |   |-- tools/       <- 6 injectable tool services
  |   |   |-- vision/      <- image OCR + LLaVA + person verify
  |   |   |-- analysis/    <- REST API controller + service
  |   |   |-- articles/    <- article CRUD
  |   |   |-- database/    <- PrismaService + DatabaseModule
  |   |-- frontend/src/
  |       |-- components/  <- reusable UI
  |       |-- pages/       <- route-level pages
  |       |-- services/    <- API call functions
  |       |-- types/       <- TypeScript interfaces
  |-- prisma/schema.prisma
  |-- .env

STRICT CODING RULES - NEVER BREAK THESE:
  1. TypeScript strict mode everywhere - ZERO "any" types
  2. Every NestJS module has: controller, service, module, dto files
  3. JSDoc on every exported function and class
  4. All DB access via PrismaService only - no raw SQL
  5. All secrets in .env - never hardcode
  6. Every async function has try/catch with proper NestJS exceptions
  7. Every tool call MUST be logged to ToolCallLog table in Prisma
  8. console.log every agent step (for hackathon demo visibility)
  9. Mobile-responsive Tailwind classes on all React components
  10. REST endpoints: POST /api/analysis/text and POST /api/analysis/image

Remember this context for the ENTIRE session.
```

---

## ⚡ Phase 0 — Environment Setup (Day 1 Morning)

> Complete ALL steps before running any other prompts.

### Step 1 — Install Prerequisites

```bash
# 1. Check Node version (needs 20+)
node -v
# If below 20: nvm install 20 && nvm use 20

# 2. Install Ollama from https://ollama.com/download
ollama pull qwen2.5-coder:7b   # text + tool calling (4GB)
ollama pull llava:7b            # vision + image analysis (4GB)

# Verify Ollama works:
ollama list
curl http://localhost:11434/api/tags

# 3. Install VS Code extensions (Ctrl+Shift+X):
#   - Cline (by saoudrizwan)
#   - Prisma
#   - ESLint
#   - Prettier
#   - Thunder Client
#   - Tailwind CSS IntelliSense

# 4. Configure Cline:
#   VS Code -> Cline sidebar -> gear icon -> Settings
#   Provider: Ollama | Base URL: http://localhost:11434
#   Model: qwen2.5-coder:7b | Max tokens: 8192

# 5. Create free accounts:
#   Supabase: https://supabase.com
#   Vercel:   https://vercel.com
#   Render:   https://render.com
#   Groq:     https://console.groq.com
```

### Step 2 — Repo Structure Setup

```bash
git clone https://github.com/[YOUR_ORG]/AI-Lie-detection.git
cd AI-Lie-detection

mkdir -p apps/backend/src/{agent,tools,vision,analysis,articles,database,common}
mkdir -p apps/frontend/src/{components,pages,hooks,services,types}
mkdir -p prisma
touch .env .env.example .gitignore README.md

# .gitignore content:
# node_modules/ | .env | dist/ | .next/ | *.log

npm init -y
npm install concurrently -D

git add .
git commit -m "feat: initial project structure"
git push origin main
```

---

## 🗄️ Phase 1 — Database: Supabase + Prisma

> Go to supabase.com → New Project. Get: Project URL, anon key, and DATABASE_URL from Settings → Database → Connection String (URI mode).

### Step 1 — Environment Variables

```env
# .env file (project root)

DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"

OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_TEXT_MODEL="qwen2.5-coder:7b"
OLLAMA_VISION_MODEL="llava:7b"

GROQ_API_KEY="[GET FROM console.groq.com]"

PORT=3001
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

### Step 2 — Prisma Schema

```bash
cd apps/backend
npm install prisma @prisma/client
npx prisma init --datasource-provider postgresql
```

**`prisma/schema.prisma`:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Article {
  id         String     @id @default(cuid())
  url        String?
  text       String
  title      String?
  sourceType SourceType @default(TEXT)
  createdAt  DateTime   @default(now())
  analyses   Analysis[]
}

model Analysis {
  id              String       @id @default(cuid())
  articleId       String
  article         Article      @relation(fields: [articleId], references: [id], onDelete: Cascade)
  analysisType    AnalysisType @default(TEXT)
  verdict         Verdict
  confidenceScore Float        @default(0)
  explanation     String
  processingMs    Int          @default(0)
  imagePath       String?
  personDetected  String?
  personVerified  Boolean?
  officialSources Json?
  toolCalls       ToolCallLog[]
  createdAt       DateTime     @default(now())
}

model ToolCallLog {
  id         String   @id @default(cuid())
  analysisId String
  analysis   Analysis @relation(fields: [analysisId], references: [id], onDelete: Cascade)
  toolName   String
  input      Json
  output     Json
  durationMs Int
  success    Boolean  @default(true)
  errorMsg   String?
  createdAt  DateTime @default(now())
}

enum Verdict      { REAL FAKE UNCERTAIN }
enum SourceType   { TEXT URL IMAGE }
enum AnalysisType { TEXT IMAGE_PERSON_VERIFY }
```

```bash
npx prisma generate
npx prisma db push
npx prisma studio   # verify tables at localhost:5555
```

**`src/database/prisma.service.ts`:**
```ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/** Global NestJS wrapper for PrismaClient. Injectable singleton. */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await this.$connect();
    console.log("Database connected via Prisma");
  }
}
```

**`src/database/database.module.ts`:**
```ts
import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class DatabaseModule {}
```

---

## ⚙️ Phase 2 — Backend Setup: NestJS

### Step 1 — Install Dependencies

```bash
cd apps/backend
npm install -g @nestjs/cli
nest new . --skip-git --package-manager npm

# Core
npm install @nestjs/config @nestjs/swagger swagger-ui-express
npm install class-validator class-transformer
npm install axios @nestjs/axios

# Image processing
npm install tesseract.js sharp multer @types/multer

# Utilities
npm install uuid @types/uuid

# Dev
npm install -D @types/node @types/express jest @nestjs/testing ts-jest
```

**`tsconfig.json` additions:**
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true
  }
}
```

### Step 2 — Bootstrap Files

**`src/main.ts`:**
```ts
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    methods: ["GET","POST","PUT","DELETE","PATCH"],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder()
    .setTitle("AI Lie Detection API")
    .setDescription("Fake news detector with tool-calling AI agent")
    .setVersion("1.0").build();
  SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, config));
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
```

**`src/app.module.ts`:**
```ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { ToolsModule } from "./tools/tools.module";
import { AgentModule } from "./agent/agent.module";
import { ArticlesModule } from "./articles/articles.module";
import { AnalysisModule } from "./analysis/analysis.module";
import { VisionModule } from "./vision/vision.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "../../.env" }),
    DatabaseModule, ToolsModule, AgentModule,
    ArticlesModule, AnalysisModule, VisionModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
```

**`src/health.controller.ts`:**
```ts
import { Controller, Get } from "@nestjs/common";

/** Health check endpoint — required for Render.com to keep service alive */
@Controller("health")
export class HealthController {
  @Get()
  check() { return { status: "ok", timestamp: new Date().toISOString() }; }
}
```

---

## 🔧 Phase 3 — Tool Services

> Each tool is a NestJS `@Injectable()` service. Build **ALL** tools before the agent loop.

### Tool 1 — `check_domain_credibility` → `src/tools/domain-credibility.tool.ts`

```
Prompt Cline:
Create @Injectable() DomainCredibilityTool service.
Input:  { url: string }
Output: { domain, credibilityScore, classification, reason }

Logic:
1. Parse domain via new URL(url).hostname, remove www.
2. Check KNOWN_FAKE_DOMAINS array (20+ domains):
   worldnewsdailyreport.com, empirenews.net, abcnews.com.co, clickhole.com,
   nationalreport.net, beforeitsnews.com, thespoof.com, huzlers.com,
   realnewsrightnow.com, newslo.com, superofficialnews.com, freedomcrossroads.us
3. Check KNOWN_CREDIBLE_DOMAINS array (20+ domains):
   reuters.com, apnews.com, bbc.com, npr.org, theguardian.com,
   nytimes.com, washingtonpost.com, snopes.com, factcheck.org,
   politifact.com, who.int, cdc.gov, nih.gov, nasa.gov
4. Unknown domain: score=50, +20 for .gov/.edu, -10 for .net/.biz
5. classification: "credible"|"suspicious"|"known_fake"|"unknown"
Add JSDoc. Export class and interfaces. Show complete file.
```

### Tool 2 — `extract_claims` → `src/tools/claim-extractor.tool.ts`

```
Prompt Cline:
Create @Injectable() ClaimExtractorTool service.
Input:  { text: string }
Output: { claims: string[], claimCount: number, keyEntities: string[] }

Logic:
1. Split text into sentences on . ? !
2. Filter sentences that contain:
   - Numbers/percentages: /\d+(\.\d+)?%?/
   - Years/dates: /\b(19|20)\d{2}\b/
   - Statistical language: "according to", "study", "percent", "million"
   - Quoted speech: sentences with quotation marks
3. Return top 8 factual claims (deduplicated, trimmed)
4. Extract key entities: regex for consecutive capitalized words
Add JSDoc. Export class and interfaces. Show complete file.
```

### Tool 3 — `analyze_sentiment_bias` → `src/tools/sentiment-bias.tool.ts`

```
Prompt Cline:
Create @Injectable() SentimentBiasTool service.
Input:  { text: string }
Output: { biasScore, emotionalTriggers, capsRatio, exclamationCount, loadedWords, verdict }

Logic:
1. capsRatio: uppercase letters / total letters
2. exclamationCount: count all ! characters
3. Emotional trigger words (case insensitive):
   SHOCKING, BOMBSHELL, EXPOSED, BREAKING, URGENT, MUST READ,
   YOU WONT BELIEVE, COVER UP, MAINSTREAM MEDIA, MIRACLE CURE,
   BANNED, CENSORED, CONSPIRACY, HOAX, SILENCED, DEEP STATE
4. biasScore:
   capsRatio > 0.3 ? +30 : capsRatio > 0.15 ? +15 : 0
   exclamationCount * 5 (max 30)
   emotionalTriggers.length * 10 (max 40) — capped at 100
5. verdict: "NEUTRAL"(0-30), "BIASED"(31-60), "HIGHLY_MANIPULATIVE"(61-100)
Add JSDoc. Export class and interfaces. Show complete file.
```

### Tool 4 — `search_fact_database` → `src/tools/fact-search.tool.ts`

```
Prompt Cline:
Create @Injectable() FactSearchTool service.
Inject PrismaService.
Input:  { claim: string }
Output: { relatedAnalyses: Array<{id,verdict,explanation,createdAt}>, found, matchCount }

Logic:
1. Extract keywords: split by spaces, filter words > 4 chars, remove stop words, keep top 3
2. For each keyword search Prisma Analysis table:
   prisma.analysis.findMany({
     where: { explanation: { contains: keyword, mode: "insensitive" } },
     take: 3,
     include: { article: { select: { title: true } } }
   })
3. Deduplicate by id, return up to 3 results
4. found = results.length > 0
Add JSDoc. Export class and interfaces. Show complete file.
```

### Tool 5 — `cross_reference_sources` → `src/tools/cross-reference.tool.ts`

```
Prompt Cline:
Create @Injectable() CrossReferenceTool service.
Inject PrismaService.
Input:  { headline: string }
Output: { corroborated, sources: Array<{title,verdict,url}>, contradictions, confidence }

Logic:
1. Extract 3-5 key nouns from headline (words > 4 chars, not stop words)
2. Search Article table for similar titles per keyword
3. Get each matched article's Analysis verdict
4. Multiple agreeing verdicts = corroborated = true
5. Contradicting verdicts = add to contradictions array
6. confidence = (corroborating / total) * 100
Add JSDoc. Export class and interfaces. Show complete file.
```

### Tool 6 — `verify_person_statement` → `src/tools/person-verify.tool.ts`

```
Prompt Cline:
Create @Injectable() PersonVerifyTool service.
Inject HttpService from @nestjs/axios.
Input:  { personName: string, statement: string, context?: string }
Output: { verified, confidence, officialSources: Array<{url,found,statusChecked}>, verdict, explanation }

Logic:
1. OFFICIAL_SOURCES registry (hardcoded Map):
   "WHO"           -> ["who.int/news", "who.int/director-general/speeches"]
   "CDC"           -> ["cdc.gov/media/releases"]
   "Narendra Modi" -> ["pmindia.gov.in", "narendramodi.in"]
   "Joe Biden"     -> ["whitehouse.gov/briefing-room"]
   Default fallback -> Wikipedia page for personName

2. Extract 3-5 key words from statement
3. For each official URL:
   - axios GET with 5s timeout
   - Check if page body contains statement keywords
   - Add 1s delay between requests (respectful scraping)
   - Handle errors gracefully

4. Found on official source: verified=true, confidence=90
   Not found: verified=false, confidence=20
   All HTTP errors: verdict="UNVERIFIED"

5. verdict: "VERIFIED"|"FABRICATED"|"UNVERIFIED"
   FABRICATED only when statement directly contradicts official statements
   UNVERIFIED = not found (absence of evidence != fabrication)
Add JSDoc. Export class and interfaces. Show complete file.
```

### Tools Module → `src/tools/tools.module.ts`

```ts
import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { DomainCredibilityTool } from "./domain-credibility.tool";
import { ClaimExtractorTool } from "./claim-extractor.tool";
import { SentimentBiasTool } from "./sentiment-bias.tool";
import { FactSearchTool } from "./fact-search.tool";
import { CrossReferenceTool } from "./cross-reference.tool";
import { PersonVerifyTool } from "./person-verify.tool";

@Module({
  imports: [HttpModule],
  providers: [
    DomainCredibilityTool, ClaimExtractorTool, SentimentBiasTool,
    FactSearchTool, CrossReferenceTool, PersonVerifyTool,
  ],
  exports: [
    DomainCredibilityTool, ClaimExtractorTool, SentimentBiasTool,
    FactSearchTool, CrossReferenceTool, PersonVerifyTool,
  ],
})
export class ToolsModule {}
```

---

## 👁️ Phase 4 — Vision Module (Image Analysis)

> This is the unique differentiator feature. Image → Tesseract OCR → LLaVA person ID → PersonVerifyTool → verdict.

```
Prompt Cline:
Create 4 files in apps/backend/src/vision/:

=== vision.dto.ts ===
AnalyzeImageDto { personHint?: string (IsOptional IsString) }

=== vision-result.interface.ts ===
VisionAnalysisResult {
  extractedText: string
  personDetected: string | null
  imageType: string
  ocrConfidence: number
  personVerification: {
    verified: boolean
    confidence: number
    officialSources: Array<{ url: string; found: boolean }>
    verdict: "VERIFIED" | "FABRICATED" | "UNVERIFIED"
    explanation: string
  } | null
}

=== vision.service.ts ===
@Injectable() VisionService. Inject: ConfigService, PersonVerifyTool

Method 1: async analyzeImage(imageBuffer, mimeType, personHint?):
  Step 1: extractTextWithOCR(imageBuffer) using Tesseract.js:
    const result = await Tesseract.recognize(imageBuffer, "eng");
    return result.data.text;
  Step 2: analyzeWithLLaVA(imageBuffer, mimeType):
    POST to OLLAMA_BASE_URL/api/chat with llava:7b model
    Send base64 image with prompt:
    "Who is the person shown? What type of image is this (tweet, quote card, news clip)?
     What text is attributed to them? Reply in JSON: { personName, imageType, context }"
  Step 3: personName = llavaResult.personName || personHint || null
  Step 4: If personName and text: call personVerifyTool.execute({ personName, statement: text })
  Step 5: Return combined VisionAnalysisResult

=== vision.controller.ts ===
@Post("image") @UseInterceptors(FileInterceptor("image", { limits: { fileSize: 10MB } }))
Accepts multipart/form-data with "image" field
Calls visionService.analyzeImage(), creates DB records, returns { analysisId }

=== vision.module.ts ===
@Module importing HttpModule, ToolsModule
Show all complete file contents.
```

---

## 🤖 Phase 5 — Agent Loop (The Brain)

> Read this entire section before running it in Cline. This is the most important code in the project.

```
Prompt Cline:
Create 4 files in apps/backend/src/agent/:

=== agent-types.ts ===
Export interfaces only:
OllamaMessage:   { role: "system"|"user"|"assistant", content: string }
OllamaToolCall:  { function: { name: string, arguments: Record<string, unknown> } }
OllamaResponse:  { message: { content: string, tool_calls?: OllamaToolCall[] } }
ToolCallRecord:  { toolName, input, output, durationMs, success }
AgentResult:     { verdict, confidenceScore, explanation, toolCallsExecuted, totalProcessingMs }

=== tool-executor.service.ts ===
@Injectable() ToolExecutorService. Inject all 5 text tools (NOT PersonVerifyTool).
Method execute(toolName, input): start=Date.now(), switch on toolName -> call correct tool,
return { output, durationMs: Date.now()-start, success }. Wrap in try/catch.

=== agent.service.ts ===
@Injectable() AgentService. Inject: ToolExecutorService, PrismaService, ConfigService

SYSTEM_PROMPT:
"You are a fake news detection AI. Analyze the article using available tools.
MUST call at least 3 tools before giving verdict.
After tools, respond with ONLY this JSON:
{ \"verdict\": \"FAKE\"|\"REAL\"|\"UNCERTAIN\", \"confidence\": 0-100, \"explanation\": \"2-3 sentences\" }"

OLLAMA_TOOLS constant: array of 5 tool definitions (name, description, parameters JSON schema)

METHOD runAnalysis(articleText, articleId, analysisId):

const messages = [
  { role: "system", content: SYSTEM_PROMPT },
  { role: "user", content: "Analyze this article: " + articleText }
];
let iterations = 0;
const toolCallsLog = [];
const startTime = Date.now();

while (iterations < 10) {
  iterations++;
  console.log("[AGENT] Iteration " + iterations);

  const response = await axios.post(OLLAMA_BASE_URL + "/api/chat", {
    model: OLLAMA_TEXT_MODEL, messages, tools: OLLAMA_TOOLS, stream: false
  });

  if (response.data.message.tool_calls?.length > 0) {
    messages.push({ role: "assistant", content: response.data.message.content || "" });

    for (const toolCall of response.data.message.tool_calls) {
      const { name, arguments: args } = toolCall.function;
      console.log("[AGENT] Calling tool: " + name);
      const result = await this.toolExecutor.execute(name, args);
      toolCallsLog.push({ toolName: name, input: args, ...result });
      await this.prisma.toolCallLog.create({ data: { analysisId, toolName: name, input: args, ...result } });
      messages.push({ role: "user", content: "Tool " + name + " result: " + JSON.stringify(result.output) });
    }
  } else {
    const finalAnswer = this.parseFinalAnswer(response.data.message.content);
    return { ...finalAnswer, toolCallsExecuted: toolCallsLog, totalProcessingMs: Date.now() - startTime };
  }
}
return { verdict: "UNCERTAIN", confidenceScore: 30, explanation: "Max iterations reached.",
         toolCallsExecuted: toolCallsLog, totalProcessingMs: Date.now() - startTime };

parseFinalAnswer(content):
  Try 1: JSON.parse(content.trim())
  Try 2: extract JSON via /\{[\s\S]*\}/ regex
  Try 3: keyword scan for FAKE/REAL/UNCERTAIN
  Fallback: UNCERTAIN + content.slice(0, 200)

=== agent.module.ts ===
@Module importing ToolsModule, DatabaseModule. Providers/Exports: AgentService, ToolExecutorService
Show all complete file contents.
```

---

## 🔌 Phase 6 — Analysis REST API

```
Prompt Cline:
Build src/analysis/ and src/articles/ modules completely.

=== src/articles/ ===
articles.dto.ts: CreateArticleDto { url?(IsUrl), text(IsString MinLength 10), title?(IsString) }
articles.service.ts: create(data), findOne(id), findAll(limit=10) — all via PrismaService
articles.module.ts: providers/exports ArticlesService

=== src/analysis/ ===
analysis.dto.ts: AnalyzeTextDto { url?(IsOptional IsUrl), text?(IsOptional IsString) }
  Add @ValidateIf so at least one of url or text is required.

analysis.service.ts:
  analyzeText(dto):
    1. If URL: fetch HTML via axios, strip tags via regex, take first 3000 chars
    2. prisma.article.create({ url, text, sourceType })
    3. prisma.analysis.create({ articleId, verdict: "UNCERTAIN", explanation: "In progress..." })
    4. agentService.runAnalysis(text, article.id, analysis.id)
    5. prisma.analysis.update({ verdict, confidenceScore, explanation, processingMs })
    6. return { analysisId }

  getAnalysis(id): findUniqueOrThrow + include toolCalls + article
  getRecent(limit): findMany orderBy createdAt desc + include article
  getStats(): groupBy verdict, _count true

analysis.controller.ts:
  POST /analysis/text -> analyzeText
  GET  /analysis/stats -> getStats
  GET  /analysis/recent -> getRecent(?limit)
  GET  /analysis/:id -> getAnalysis
  Add @ApiOperation + @ApiResponse Swagger decorators everywhere.

analysis.module.ts: imports ArticlesModule, AgentModule
Update app.module.ts to include both modules.
Show all complete file contents.
```

---

## 🎨 Phase 7 — Frontend: React Dashboard

### Setup

```bash
cd apps/frontend
npm create vite@latest . -- --template react-ts
npm install

npm install react-router-dom @tanstack/react-query axios lucide-react recharts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# tailwind.config.js content: ["./index.html", "./src/**/*.{ts,tsx}"]
# src/index.css: @tailwind base; @tailwind components; @tailwind utilities;

# Create .env:
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

### Types + API Service

```
Prompt Cline:
Create src/types/index.ts:
  type Verdict = "REAL" | "FAKE" | "UNCERTAIN"
  type AnalysisType = "TEXT" | "IMAGE_PERSON_VERIFY"
  interface ToolCallLog { id, toolName, input, output, durationMs, success, createdAt }
  interface Analysis { id, verdict, confidenceScore, explanation, processingMs,
                       analysisType, personDetected?, personVerified?, toolCalls, article, createdAt }
  interface DashboardStats { total, fake, real, uncertain }

Create src/services/api.ts:
  axios instance: baseURL=VITE_API_URL, timeout=90000
  analyzeText(data: { text?, url? }) -> POST /analysis/text
  analyzeImage(formData: FormData) -> POST /analysis/image (multipart)
  getAnalysis(id) -> GET /analysis/:id
  getRecentAnalyses(limit=10) -> GET /analysis/recent
  getStats() -> GET /analysis/stats
```

### App.tsx + Layout

```
Prompt Cline:
Create src/App.tsx with React Router routes:
  / -> DashboardPage
  /analyze/text -> AnalyzeTextPage
  /analyze/image -> AnalyzeImagePage
  /result/:id -> ResultPage
  /history -> HistoryPage
  All wrapped in QueryClientProvider + BrowserRouter

Create src/components/Layout.tsx:
  Dark sidebar: bg-gray-950, w-64
  Logo: ShieldAlert icon (lucide) + "AI Lie Detector"
  NavLinks with NavLink (active=bg-red-600, inactive=text-gray-400 hover:bg-gray-800):
    / -> LayoutDashboard -> Dashboard
    /analyze/text -> FileText -> Analyze Article
    /analyze/image -> ImageIcon -> Verify Image
    /history -> Clock -> History
  Main: bg-gray-900, <Outlet /> in <main className="flex-1 overflow-auto p-6">
```

### Dashboard Page

```
Prompt Cline:
Create src/pages/DashboardPage.tsx:
  useQuery(["stats"], getStats) + useQuery(["recent"], getRecentAnalyses)

  1. Stats row (grid-cols-2 lg:grid-cols-4):
     Total (blue/BarChart3), FAKE (red/AlertTriangle),
     REAL (green/CheckCircle), Uncertain (yellow/HelpCircle)
     Each: big number + label + % of total

  2. PieChart (recharts, 300px):
     FAKE=#EF4444, REAL=#22C55E, UNCERTAIN=#EAB308, include Legend

  3. Recent table (overflow-x-auto):
     Date | Preview | Type | Verdict badge | Confidence | View button
     FAKE=bg-red-500, REAL=bg-green-500, UNCERTAIN=bg-yellow-500

  4. Loading: 4 animated pulse skeleton cards
```

### Analyze Text Page

```
Prompt Cline:
Create src/pages/AnalyzeTextPage.tsx:
  Tabs: "Paste Text" | "Enter URL"
  State: mode, text, url, isLoading, error, progressMsg
  Progress messages (cycle every 2.5s via setInterval):
    "Checking domain credibility..." | "Extracting factual claims..." |
    "Analyzing sentiment and bias..." | "Searching fact database..." |
    "Cross-referencing sources..." | "Synthesizing verdict..."
  onSubmit: analyzeText -> navigate("/result/" + analysisId)
  UI: bg-gray-800 card, tab buttons, textarea/input, bg-red-600 submit button
  Loading overlay: spinner + rotating progressMsg
  Validation: text min 50 chars, URL valid format
```

### Analyze Image Page

```
Prompt Cline:
Create src/pages/AnalyzeImagePage.tsx:
  State: file, preview, personHint, isLoading, error, progressMsg
  Progress messages:
    "Extracting text from image (OCR)..." | "Identifying person with AI vision..." |
    "Looking up official sources..." | "Verifying statement authenticity..."
  onSubmit: FormData -> analyzeImage -> navigate("/result/" + analysisId)
  UI:
    Info banner (bg-blue-900): "Upload image of quote/tweet attributed to public figure"
    Drag-drop zone: dashed border, Upload icon
    Image preview: <img src={preview}> max-h-200
    personHint text input (optional)
    bg-red-600 "Verify Image" button
```

### Result Page

```
Prompt Cline:
Create src/pages/ResultPage.tsx:
  useQuery(["analysis", id], () => getAnalysis(id!), { refetchInterval: 3000 })
  Stop polling when toolCalls.length > 0 && verdict !== "UNCERTAIN"

  1. VERDICT HERO card:
     FAKE: bg-red-950 border-red-500 | REAL: bg-green-950 border-green-500
     UNCERTAIN: bg-yellow-950 border-yellow-500
     Big verdict text + confidence progress bar + explanation + processing time

  2. PERSON VERIFICATION (if analysisType === IMAGE_PERSON_VERIFY):
     personDetected name, VERIFIED/FABRICATED/UNVERIFIED badge,
     list of official sources checked

  3. TOOL CALLS ACCORDION (most important for judges):
     "Agent Tool Calls (N)" expandable header
     Each tool: name badge (colored) | duration | success icon
     Expanded: pretty-printed input JSON + output JSON

  4. ARTICLE PREVIEW: first 400 chars + source URL link

  5. Actions: "Analyze Another" -> /analyze/text | "Copy Link" button
```

### History Page

```
Prompt Cline:
Create src/pages/HistoryPage.tsx:
  useQuery(["history"], () => getRecentAnalyses(50))
  Cards grid (grid-cols-1 lg:grid-cols-2):
    Verdict badge | 100 chars of text | confidence% | analysis type | date
    "View Full Report" -> /result/:id
  Empty state message if no analyses
```

---

## 🚀 Phase 8 — GitHub + Deployment

### Team Git Workflow

```bash
# Recommended team split:
# Person 1 (Backend):      apps/backend  — Phase 1 through 6
# Person 2 (Frontend):     apps/frontend — Phase 7
# Person 3 (Vision+Deploy): Phase 4 + Phase 8

# Feature branches:
git checkout -b feat/backend-agent
git checkout -b feat/frontend-dashboard
git checkout -b feat/vision-module

# Commit often:
git add .
git commit -m "feat: add domain credibility tool"
git push origin feat/backend-agent

# PR -> review -> merge to main
# NEVER commit .env — share secrets via Discord/secure notes
```

### Deploy Frontend → Vercel (Free)

```
1. vercel.com -> Add New Project
2. Import: AI-Lie-detection repo
3. Framework: Vite | Root Directory: apps/frontend
   Build: npm run build | Output: dist
4. Environment Variable:
   VITE_API_URL = https://[your-render-url].onrender.com/api
5. Deploy -> get https://ai-lie-detection.vercel.app
```

### Deploy Backend → Render (Free)

```
1. render.com -> New -> Web Service
2. Connect GitHub -> AI-Lie-detection
3. Settings:
   Root Directory: apps/backend
   Build: npm install && npm run build && npx prisma generate
   Start: node dist/main.js
4. Environment Variables:
   DATABASE_URL, PORT=3001, FRONTEND_URL, NODE_ENV=production, GROQ_API_KEY
```

> ⚠️ **Important:** Ollama can't run on Render (no local GPU). Use **Groq free tier** in production.

**Update `agent.service.ts` for production:**
```ts
private async callLLM(messages, tools) {
  if (process.env.NODE_ENV === "production") {
    // Groq in production (OpenAI-compatible format)
    return axios.post("https://api.groq.com/openai/v1/chat/completions",
      { model: "llama-3.3-70b-versatile", messages, tools, tool_choice: "auto" },
      { headers: { "Authorization": "Bearer " + process.env.GROQ_API_KEY } }
    );
  } else {
    // Ollama locally
    return axios.post(process.env.OLLAMA_BASE_URL + "/api/chat",
      { model: process.env.OLLAMA_TEXT_MODEL, messages, tools, stream: false }
    );
  }
}
```

> **Note:** Groq tool_calls → `response.data.choices[0].message.tool_calls`  
> Ollama tool_calls → `response.data.message.tool_calls`  
> Abstract this difference in your `callLLM` helper.

---

## 📅 Hackathon Timeline

| Day | Who | Deliverable |
|---|---|---|
| **Day 1 AM** | Everyone | Phase 0: Env setup, Ollama, dependencies, Supabase + Prisma deployed |
| **Day 1 PM** | Person 1 | Phase 1–3: NestJS bootstrap + all 6 tool services written and tested |
| **Day 2 AM** | Person 1 | Phase 5–6: Agent loop + Analysis REST API, test with Thunder Client |
| **Day 2 AM** | Person 2 | Phase 7 Steps 1–4: Vite + types + API service + Layout + Dashboard |
| **Day 2 PM** | Person 3 | Phase 4: Vision module (OCR + LLaVA + PersonVerify) end-to-end |
| **Day 2 PM** | Person 2 | Phase 7 Steps 5–7: AnalyzeText + AnalyzeImage + Result + History |
| **Day 3 AM** | Everyone | Integration: connect frontend to backend, test full text analysis flow |
| **Day 3 AM** | Everyone | Test image verification flow end-to-end |
| **Day 3 PM** | Person 3 | Phase 8: Deploy Vercel + Render, verify live URLs |
| **Wed Evening** | Everyone | Bug fixes, UI polish, write README demo instructions |
| **Thursday** | Everyone | **SUBMIT!** Demo fake news article + image verification |

---

## 💻 Daily Dev Commands

```bash
# Terminal 1 — Keep Ollama running:
ollama serve

# Terminal 2 — Backend:
cd apps/backend && npm run start:dev

# Terminal 3 — Frontend:
cd apps/frontend && npm run dev

# Terminal 4 — DB viewer (optional):
npx prisma studio

# Test API with Thunder Client:
# POST http://localhost:3001/api/analysis/text
# Body: { "text": "SHOCKING: Scientists EXPOSE vaccine HOAX that mainstream media wont tell you!" }

# Swagger docs:
# http://localhost:3001/api/docs

# Push to GitHub:
git add . && git commit -m "feat: [what you built]" && git push

# After Prisma schema changes:
npx prisma db push && npx prisma generate
```

---

## 🏆 Demo Script (Thursday Submission)

**Demo 1 — Fake News Text (2 min):**
1. Paste a sensational fake news article
2. Show FAKE verdict with red UI
3. Open Tool Calls accordion — show all 5 tools executed step by step
4. Point out confidence score and explanation

**Demo 2 — Image Verification (1 min):**
1. Upload a screenshot of a fabricated quote attributed to a public figure
2. Show: Person Detected → official sources searched → FABRICATED verdict
3. Show the official sources that were checked

> 💡 **Judge tip:** The Tool Calls accordion is your secret weapon. Showing exactly how the agent reasoned demonstrates technical depth and explainability — two things judges score highly.

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analysis/text` | Submit article text or URL for analysis |
| `POST` | `/api/analysis/image` | Upload image for person verification |
| `GET` | `/api/analysis/:id` | Get full result + all tool call logs |
| `GET` | `/api/analysis/recent` | Last 10 analyses (dashboard) |
| `GET` | `/api/analysis/stats` | Aggregate counts (FAKE/REAL/UNCERTAIN) |
| `GET` | `/api/health` | Health check (required for Render) |
| `GET` | `/api/docs` | Swagger UI documentation |
