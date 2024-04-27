-- CreateTable
CREATE TABLE `User` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `isSuperAccount` BOOLEAN NOT NULL DEFAULT false,
    `Name` VARCHAR(191) NULL,

    UNIQUE INDEX `User_Email_key`(`Email`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favourite` (
    `UserId` INTEGER NOT NULL,
    `HFId` INTEGER NOT NULL,

    PRIMARY KEY (`UserId`, `HFId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `UserId` INTEGER NOT NULL,
    `HFId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `point` DOUBLE NOT NULL,

    PRIMARY KEY (`UserId`, `HFId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HealthFood` (
    `Id` INTEGER NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `AcessDate` DATETIME(3) NOT NULL,
    `IsAcess` VARCHAR(191) NOT NULL,
    `Ingredient` VARCHAR(191) NOT NULL,
    `Benefits` VARCHAR(191) NOT NULL,
    `Claims` VARCHAR(191) NOT NULL,
    `Warning` VARCHAR(191) NOT NULL,
    `Precautions` VARCHAR(191) NOT NULL,
    `Website` VARCHAR(191) NOT NULL,
    `ApplicantId` INTEGER NOT NULL,

    UNIQUE INDEX `HealthFood_Name_key`(`Name`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Applicant` (
    `Id` INTEGER NOT NULL,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
