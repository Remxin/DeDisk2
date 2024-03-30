-- DropForeignKey
ALTER TABLE `Favourite` DROP FOREIGN KEY `Favourite_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Share` DROP FOREIGN KEY `Share_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Favourite` ADD CONSTRAINT `Favourite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Share` ADD CONSTRAINT `Share_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
