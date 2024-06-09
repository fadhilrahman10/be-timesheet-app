/*
  Warnings:

  - You are about to drop the column `rate` on the `timesheets` table. All the data in the column will be lost.
  - Changed the type of `duration` on the `timesheets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "timesheets" DROP COLUMN "rate",
DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL;
