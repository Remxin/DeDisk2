/*
  Warnings:

  - Added the required column `sharedSource` to the `Share` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Share` ADD COLUMN `sharedSource` VARCHAR(191) NOT NULL;
