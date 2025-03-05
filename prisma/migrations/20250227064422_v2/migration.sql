-- CreateTable
CREATE TABLE `RecommendList` (
    `Id` VARCHAR(191) NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `IsPublic` BOOLEAN NOT NULL DEFAULT false,
    `UserId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecommendList_and_HF` (
    `RLId` VARCHAR(191) NOT NULL,
    `HFId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`RLId`, `HFId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecommendList` ADD CONSTRAINT `RecommendList_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecommendList_and_HF` ADD CONSTRAINT `RecommendList_and_HF_RLId_fkey` FOREIGN KEY (`RLId`) REFERENCES `RecommendList`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecommendList_and_HF` ADD CONSTRAINT `RecommendList_and_HF_HFId_fkey` FOREIGN KEY (`HFId`) REFERENCES `HealthFood`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
