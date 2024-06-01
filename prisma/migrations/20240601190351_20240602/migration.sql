-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_HFId_fkey`;

-- DropForeignKey
ALTER TABLE `favourite` DROP FOREIGN KEY `Favourite_HFId_fkey`;

-- DropForeignKey
ALTER TABLE `hf_and_bf` DROP FOREIGN KEY `HF_and_BF_HFId_fkey`;

-- DropForeignKey
ALTER TABLE `hf_and_ingredient` DROP FOREIGN KEY `HF_and_Ingredient_HFId_fkey`;

-- AddForeignKey
ALTER TABLE `Favourite` ADD CONSTRAINT `Favourite_HFId_fkey` FOREIGN KEY (`HFId`) REFERENCES `HealthFood`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_HFId_fkey` FOREIGN KEY (`HFId`) REFERENCES `HealthFood`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HF_and_Ingredient` ADD CONSTRAINT `HF_and_Ingredient_HFId_fkey` FOREIGN KEY (`HFId`) REFERENCES `HealthFood`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HF_and_BF` ADD CONSTRAINT `HF_and_BF_HFId_fkey` FOREIGN KEY (`HFId`) REFERENCES `HealthFood`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
