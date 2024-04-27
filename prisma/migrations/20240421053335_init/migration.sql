/*
  Warnings:

  - You are about to drop the column `Benefits` on the `healthfood` table. All the data in the column will be lost.
  - You are about to drop the column `Ingredient` on the `healthfood` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `healthfood` DROP COLUMN `Benefits`,
    DROP COLUMN `Ingredient`;

-- CreateTable
CREATE TABLE `Ingredient` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NULL,
    `EnglishName` VARCHAR(191) NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HF_and_Ingredient` (
    `HFId` INTEGER NOT NULL,
    `IGId` INTEGER NOT NULL,

    PRIMARY KEY (`HFId`, `IGId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Benefits` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HF_and_BF` (
    `HFId` INTEGER NOT NULL,
    `BFId` INTEGER NOT NULL,

    PRIMARY KEY (`HFId`, `BFId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HF_and_Ingredient` ADD CONSTRAINT `HF_and_Ingredient_HFId_fkey` FOREIGN KEY (`HFId`) REFERENCES `HealthFood`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HF_and_Ingredient` ADD CONSTRAINT `HF_and_Ingredient_IGId_fkey` FOREIGN KEY (`IGId`) REFERENCES `Ingredient`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HF_and_BF` ADD CONSTRAINT `HF_and_BF_HFId_fkey` FOREIGN KEY (`HFId`) REFERENCES `HealthFood`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HF_and_BF` ADD CONSTRAINT `HF_and_BF_BFId_fkey` FOREIGN KEY (`BFId`) REFERENCES `Benefits`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
