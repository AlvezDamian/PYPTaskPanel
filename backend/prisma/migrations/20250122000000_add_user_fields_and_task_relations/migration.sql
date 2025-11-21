-- Add firstName, lastName, and role to users table
ALTER TABLE `users` ADD COLUMN `firstName` VARCHAR(191) NULL;
ALTER TABLE `users` ADD COLUMN `lastName` VARCHAR(191) NULL;
ALTER TABLE `users` ADD COLUMN `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';

-- Modify TaskStatus enum: add new values
ALTER TABLE `tasks` MODIFY COLUMN `status` ENUM('PENDING', 'COMPLETED', 'TODO', 'DOING', 'DONE') NOT NULL DEFAULT 'TODO';

-- Migrate existing status values: PENDING -> TODO, COMPLETED -> DONE
UPDATE `tasks` SET `status` = 'TODO' WHERE `status` = 'PENDING';
UPDATE `tasks` SET `status` = 'DONE' WHERE `status` = 'COMPLETED';

-- Remove old enum values
ALTER TABLE `tasks` MODIFY COLUMN `status` ENUM('TODO', 'DOING', 'DONE') NOT NULL DEFAULT 'TODO';

-- Add createdById and assignedToId columns (nullable first)
ALTER TABLE `tasks` ADD COLUMN `createdById` VARCHAR(191) NULL;
ALTER TABLE `tasks` ADD COLUMN `assignedToId` VARCHAR(191) NULL;

-- Migrate existing data: set createdById = userId for existing tasks
UPDATE `tasks` SET `createdById` = `userId` WHERE `createdById` IS NULL;

-- Make createdById NOT NULL
ALTER TABLE `tasks` MODIFY COLUMN `createdById` VARCHAR(191) NOT NULL;

-- Add foreign key constraints
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

