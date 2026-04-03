"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, '../.env') });
const config_1 = require("prisma/config");
const fallbackDatabaseUrl = 'postgresql://placeholder:placeholder@localhost:5432/placeholder?sslmode=disable&schema=public';
exports.default = (0, config_1.defineConfig)({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL ?? fallbackDatabaseUrl,
    },
});
//# sourceMappingURL=prisma.config.js.map