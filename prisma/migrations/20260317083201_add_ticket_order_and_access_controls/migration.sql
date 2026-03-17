-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "accessibilityIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "accessibilityRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "columnId" TEXT,
ADD COLUMN     "sortIndex" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Ticket_boardId_status_sortIndex_idx" ON "Ticket"("boardId", "status", "sortIndex");

-- CreateIndex
CREATE INDEX "Ticket_boardId_columnId_sortIndex_idx" ON "Ticket"("boardId", "columnId", "sortIndex");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "BoardColumn"("id") ON DELETE SET NULL ON UPDATE CASCADE;
