/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CurCommentNum` to the `HealthFood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CurPoint` to the `HealthFood` table without a default value. This is not possible if the table is not empty.
  - Made the column `Name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `HealthFood_Name_key` ON `healthfood`;

-- AlterTable
ALTER TABLE `healthfood` ADD COLUMN `CurCommentNum` INTEGER NOT NULL,
    ADD COLUMN `CurPoint` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `Age` INTEGER NOT NULL DEFAULT 18,
    ADD COLUMN `Gender` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `Name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_Name_key` ON `User`(`Name`);
