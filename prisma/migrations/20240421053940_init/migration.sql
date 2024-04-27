/*
  Warnings:

  - The primary key for the `applicant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `benefits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `favourite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `healthfood` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `hf_and_bf` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `hf_and_ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_HFId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `favourite` DROP FOREIGN KEY `Favourite_HFId_fkey`;

-- DropForeignKey
ALTER TABLE `favourite` DROP FOREIGN KEY `Favourite_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `healthfood` DROP FOREIGN KEY `HealthFood_ApplicantId_fkey`;

-- DropForeignKey
ALTER TABLE `hf_and_bf` DROP FOREIGN KEY `HF_and_BF_BFId_fkey`;

-- DropForeignKey
ALTER TABLE `hf_and_bf` DROP FOREIGN KEY `HF_and_BF_HFId_fkey`;

-- DropForeignKey
ALTER TABLE `hf_and_ingredient` DROP FOREIGN KEY `HF_and_Ingredient_HFId_fkey`;

-- DropForeignKey
ALTER TABLE `hf_and_ingredient` DROP FOREIGN KEY `HF_and_Ingredient_IGId_fkey`;

-- AlterTable
ALTER TABLE `applicant` DROP PRIMARY KEY,
    MODIFY `Id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `benefits` DROP PRIMARY KEY,
    MODIFY `Id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `comment` DROP PRIMARY KEY,
    MODIFY `UserId` VARCHAR(191) NOT NULL,
    MODIFY `HFId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`UserId`, `HFId`);

-- AlterTable
ALTER TABLE `favourite` DROP PRIMARY KEY,
    MODIFY `UserId` VARCHAR(191) NOT NULL,
    MODIFY `HFId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`UserId`, `HFId`);

-- AlterTable
ALTER TABLE `healthfood` DROP PRIMARY KEY,
    MODIFY `Id` VARCHAR(191) NOT NULL,
    MODIFY `ApplicantId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `hf_and_bf` DROP PRIMARY KEY,
    MODIFY `HFId` VARCHAR(191) NOT NULL,
    MODIFY `BFId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`HFId`, `BFId`);

-- AlterTable
ALTER TABLE `hf_and_ingredient` DROP PRIMARY KEY,
    MODIFY `HFId` VARCHAR(191) NOT NULL,
    MODIFY `IGId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`HFId`, `IGId`);

-- AlterTable
ALTER TABLE `ingredient` DROP PRIMARY KEY,
    MODIFY `Id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `Id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`Id`);

-- AddForeignKey
ALTER TABLE `Favourite` ADD CONSTRAINT `Favourite_HFId_fkey` FOREIGN KEY (`HFId`) REFERENCES `HealthFood`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favourite` ADD CONSTRAINT `Favourite_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_HFId_fkey` FOREIGN KEY (`HFId`) REFERENCES `HealthFood`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HealthFood` ADD CONSTRAINT `HealthFood_ApplicantId_fkey` FOREIGN KEY (`ApplicantId`) REFERENCES `Applicant`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HF_and_Ingredient` ADD CONSTRAINT `HF_and_Ingredient_HFId_fkey` FOREIGN KEY (`HFId`) REFERENCES `HealthFood`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HF_and_Ingredient` ADD CONSTRAINT `HF_and_Ingredient_IGId_fkey` FOREIGN KEY (`IGId`) REFERENCES `Ingredient`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HF_and_BF` ADD CONSTRAINT `HF_and_BF_HFId_fkey` FOREIGN KEY (`HFId`) REFERENCES `HealthFood`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HF_and_BF` ADD CONSTRAINT `HF_and_BF_BFId_fkey` FOREIGN KEY (`BFId`) REFERENCES `Benefits`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
