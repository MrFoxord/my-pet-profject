import * as dotenv from 'dotenv';
import * as path from 'path';

function loadEnv() {
  const envCandidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../.env'),
  ];

  for (const envPath of envCandidates) {
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
      return;
    }
  }
}

loadEnv();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableShutdownHooks();

  const port = process.env.PORT ?? 8081;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
