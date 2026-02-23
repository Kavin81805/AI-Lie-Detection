import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

/**
 * Application bootstrap function.
 * Initializes NestJS application with Swagger docs, CORS, and validation.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix("api");

  // Enable CORS for frontend
  app.enableCors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  });

  // Global validation pipe with whitelist
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true })
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("AI Lie Detection API")
    .setDescription(
      "Fake news detector with tool-calling AI agent and image verification"
    )
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`\n🚀 Backend running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs\n`);
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start application:", err);
  process.exit(1);
});
