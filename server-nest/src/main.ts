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
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

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

  const swaggerEnabled =
    process.env.SWAGGER_ENABLED === 'true' ||
    (process.env.SWAGGER_ENABLED !== 'false' && process.env.NODE_ENV !== 'production');

  if (swaggerEnabled) {
    const swaggerPath = process.env.SWAGGER_PATH || 'api/docs';
    const swaggerConfig = new DocumentBuilder()
      .setTitle('My Pet Project API')
      .setDescription('API documentation for frontend and QA smoke checks')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          in: 'header',
        },
        'bearer',
      )
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, swaggerDocument, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(
      `Swagger docs available on http://localhost:${process.env.PORT ?? process.env.SOCKET_SERVER_PORT ?? 8081}/${swaggerPath}`,
    );
  }

  app.enableShutdownHooks();

  const port = process.env.PORT ?? process.env.SOCKET_SERVER_PORT ?? 8081;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}

bootstrap();
