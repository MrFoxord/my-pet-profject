/*
  Warnings:

  - You are about to drop the column `accessibilityIds` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `accessibilityRoles` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "accessibilityIds",
DROP COLUMN "accessibilityRoles";
