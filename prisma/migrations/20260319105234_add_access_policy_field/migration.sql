-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "accessPolicy" JSONB NOT NULL DEFAULT '{"view":[],"edit":[],"delete":[],"estimate":[],"comment":[],"manageAccess":[]}';
