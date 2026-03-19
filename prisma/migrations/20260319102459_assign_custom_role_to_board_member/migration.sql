-- AlterTable
ALTER TABLE "BoardMember" ADD COLUMN     "customRoleId" TEXT;

-- AddForeignKey
ALTER TABLE "BoardMember" ADD CONSTRAINT "BoardMember_customRoleId_fkey" FOREIGN KEY ("customRoleId") REFERENCES "BoardRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
