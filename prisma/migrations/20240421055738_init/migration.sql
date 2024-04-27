/*
  Warnings:

  - You are about to drop the column `IsAcess` on the `healthfood` table. All the data in the column will be lost.
  - Added the required column `CFId` to the `HealthFood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `healthfood` DROP COLUMN `IsAcess`,
    ADD COLUMN `CFId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Certification` (
    `Id` VARCHAR(191) NOT NULL,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HealthFood` ADD CONSTRAINT `HealthFood_CFId_fkey` FOREIGN KEY (`CFId`) REFERENCES `Certification`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
