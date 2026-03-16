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
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
    app.enableShutdownHooks();
    const port = process.env.PORT ?? 8081;
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map