import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { PrismaClient } from '../generated/prisma/client';

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

function normalizeDatabaseUrl(raw: string): string {
  try {
    const parsed = new URL(raw);
    parsed.searchParams.delete('schema');
    const host = parsed.hostname;
    if (!parsed.searchParams.has('sslmode') &&
        (host === 'localhost' || host === '127.0.0.1' || host === '::1')) {
      parsed.searchParams.set('sslmode', 'disable');
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

// Instance type of the Prisma factory-class
type PrismaInstance = InstanceType<typeof PrismaClient>;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool;
  private readonly _client: PrismaInstance;

  constructor() {
    const rawDsn = process.env.DATABASE_URL ?? '';
    if (!rawDsn) {
      throw new Error('DATABASE_URL is not set');
    }

    const dsn = normalizeDatabaseUrl(rawDsn);
    this.pool = new Pool({ connectionString: dsn });
    const adapter = new PrismaPg(this.pool);
    this._client = new PrismaClient({ adapter }) as PrismaInstance;
  }

  // Expose model accessors so services can do this.prisma.board / boardColumn / etc.
  get board() {
    return this._client.board;
  }
  get boardColumn() {
    return this._client.boardColumn;
  }
  get ticket() {
    return this._client.ticket;
  }
  get subtask() {
    return this._client.subtask;
  }
  get comment() {
    return this._client.comment;
  }
  get user() {
    return this._client.user;
  }

  // Forward $transaction
  async $transaction<T>(
    fn: (tx: Omit<PrismaInstance, '$transaction' | '$connect' | '$disconnect'>) => Promise<T>,
  ): Promise<T>;
  async $transaction<T extends readonly unknown[]>(
    ops: [...{ [K in keyof T]: Promise<T[K]> }],
  ): Promise<T>;
  async $transaction(...args: unknown[]): Promise<unknown> {
    // Call through the Prisma client instance directly to keep internal `this` binding.
    return (this._client.$transaction as (...params: unknown[]) => Promise<unknown>)(...args);
  }

  async onModuleInit() {
    await this._client.$connect();
  }

  async onModuleDestroy() {
    await this._client.$disconnect();
    await this.pool.end();
  }
}
