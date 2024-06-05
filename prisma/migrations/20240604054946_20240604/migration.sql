-- DropForeignKey
ALTER TABLE `hf_and_bf` DROP FOREIGN KEY `HF_and_BF_BFId_fkey`;

-- DropForeignKey
ALTER TABLE `hf_and_ingredient` DROP FOREIGN KEY `HF_and_Ingredient_IGId_fkey`;

-- AddForeignKey
ALTER TABLE `HF_and_Ingredient` ADD CONSTRAINT `HF_and_Ingredient_IGId_fkey` FOREIGN KEY (`IGId`) REFERENCES `Ingredient`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HF_and_BF` ADD CONSTRAINT `HF_and_BF_BFId_fkey` FOREIGN KEY (`BFId`) REFERENCES `Benefits`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
