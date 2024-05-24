/*
  Warnings:

  - Added the required column `modifyTime` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` ADD COLUMN `modifyTime` DATETIME(3) NOT NULL;
