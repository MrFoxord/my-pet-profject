-- Add missing updatedAt column to Comment for parity with server Prisma schema
ALTER TABLE "Comment"
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
