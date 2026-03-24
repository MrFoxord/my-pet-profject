"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const dotenv = require("dotenv");
const path = require("path");
const client_1 = require("../generated/prisma/client");
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
function normalizeDatabaseUrl(raw) {
    try {
        const parsed = new URL(raw);
        parsed.searchParams.delete('schema');
        const host = parsed.hostname;
        if (!parsed.searchParams.has('sslmode') &&
            (host === 'localhost' || host === '127.0.0.1' || host === '::1')) {
            parsed.searchParams.set('sslmode', 'disable');
        }
        return parsed.toString();
    }
    catch {
        return raw;
    }
}
let PrismaService = class PrismaService {
    constructor() {
        const rawDsn = process.env.DATABASE_URL ?? '';
        if (!rawDsn) {
            throw new Error('DATABASE_URL is not set');
        }
        const dsn = normalizeDatabaseUrl(rawDsn);
        this.pool = new pg_1.Pool({ connectionString: dsn });
        const adapter = new adapter_pg_1.PrismaPg(this.pool);
        this._client = new client_1.PrismaClient({ adapter });
    }
    get board() {
        return this._client.board;
    }
    get boardColumn() {
        return this._client.boardColumn;
    }
    get boardMember() {
        return this._client.boardMember;
    }
    get ticket() {
        return this._client.ticket;
    }
    get boardRole() {
        return this._client.boardRole;
    }
    get boardInvitation() {
        return this._client.boardInvitation;
    }
    get subtask() {
        return this._client.subtask;
    }
    get comment() {
        return this._client.comment;
    }
    get notification() {
        return this._client.notification;
    }
    get user() {
        return this._client.user;
    }
    async $transaction(...args) {
        return this._client.$transaction(...args);
    }
    async onModuleInit() {
        await this._client.$connect();
    }
    async onModuleDestroy() {
        await this._client.$disconnect();
        await this.pool.end();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map