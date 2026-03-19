-- AlterTable
ALTER TABLE "BoardInvitation" ADD COLUMN "token" TEXT NOT NULL DEFAULT '';

-- Create unique constraint on token
ALTER TABLE "BoardInvitation" ADD CONSTRAINT "BoardInvitation_token_key" UNIQUE ("token");

-- Create index on token
CREATE INDEX "BoardInvitation_token_idx" ON "BoardInvitation"("token");

-- Update all existing invitations to have unique tokens (using uuid-based approach)
UPDATE "BoardInvitation" SET "token" = 'inv_' || substr(md5(random()::text), 1, 20) WHERE "token" = '';
