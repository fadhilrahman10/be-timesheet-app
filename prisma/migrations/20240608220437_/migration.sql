-- DropForeignKey
ALTER TABLE "timesheets" DROP CONSTRAINT "timesheets_user_id_fkey";

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
