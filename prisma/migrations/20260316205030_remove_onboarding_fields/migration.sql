/*
  Warnings:

  - You are about to drop the column `isOnboarded` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_nickname_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isOnboarded",
DROP COLUMN "nickname";
