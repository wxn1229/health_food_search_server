/*
  Warnings:

  - You are about to drop the column `Age` on the `user` table. All the data in the column will be lost.
  - Added the required column `Birthday` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `Age`,
    ADD COLUMN `Birthday` DATETIME(3) NOT NULL;
