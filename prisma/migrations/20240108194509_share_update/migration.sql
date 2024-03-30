/*
  Warnings:

  - Added the required column `sharedTo` to the `Share` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Share` ADD COLUMN `sharedTo` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `plan` VARCHAR(191) NOT NULL DEFAULT '0_GB';
