-- CreateEnum
CREATE TYPE "InvitationType" AS ENUM ('PERSONAL', 'SHARED');

-- AlterTable
ALTER TABLE "BoardInvitation"
  ADD COLUMN "type" "InvitationType" NOT NULL DEFAULT 'PERSONAL',
  ADD COLUMN "customRoleId" TEXT,
  ADD COLUMN "customRoleName" TEXT,
  ADD COLUMN "createdByUserId" TEXT,
  ADD COLUMN "maxUses" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "usedCount" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "BoardInvitation"
  ALTER COLUMN "email" DROP NOT NULL;

UPDATE "BoardInvitation"
SET
  "maxUses" = 1,
  "usedCount" = CASE WHEN "status" = 'accepted' THEN 1 ELSE 0 END;

DROP INDEX IF EXISTS "BoardInvitation_boardId_email_key";
ALTER TABLE "BoardInvitation" DROP COLUMN "role";

CREATE INDEX "BoardInvitation_boardId_type_idx" ON "BoardInvitation"("boardId", "type");
CREATE INDEX "BoardInvitation_customRoleId_idx" ON "BoardInvitation"("customRoleId");
CREATE INDEX "BoardInvitation_createdByUserId_idx" ON "BoardInvitation"("createdByUserId");
