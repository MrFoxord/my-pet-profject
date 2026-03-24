"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path = require("path");
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
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    }));
    app.enableCors({
        origin: process.env.ALLOWED_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const swaggerEnabled = process.env.SWAGGER_ENABLED === 'true' ||
        (process.env.SWAGGER_ENABLED !== 'false' && process.env.NODE_ENV !== 'production');
    if (swaggerEnabled) {
        const swaggerPath = process.env.SWAGGER_PATH || 'api/docs';
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('My Pet Project API')
            .setDescription('API documentation for frontend and QA smoke checks')
            .setVersion('1.0.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            in: 'header',
        }, 'bearer')
            .build();
        const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup(swaggerPath, app, swaggerDocument, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
        logger.log(`Swagger docs available on http://localhost:${process.env.PORT ?? process.env.SOCKET_SERVER_PORT ?? 8081}/${swaggerPath}`);
    }
    app.enableShutdownHooks();
    const port = process.env.PORT ?? process.env.SOCKET_SERVER_PORT ?? 8081;
    await app.listen(port);
    logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map