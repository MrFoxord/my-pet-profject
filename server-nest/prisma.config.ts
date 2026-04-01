import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import { defineConfig } from 'prisma/config';

const fallbackDatabaseUrl =
  'postgresql://placeholder:placeholder@localhost:5432/placeholder?sslmode=disable&schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? fallbackDatabaseUrl,
  },
});
