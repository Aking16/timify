PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_time_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`project_id` text,
	`description` text,
	`start_time` integer,
	`end_time` integer,
	`duration` integer,
	`is_running` integer DEFAULT true,
	`billable` integer DEFAULT false,
	`hourly_rate` real,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_time_entries`("id", "user_id", "project_id", "description", "start_time", "end_time", "duration", "is_running", "billable", "hourly_rate", "created_at", "updated_at") SELECT "id", "user_id", "project_id", "description", "start_time", "end_time", "duration", "is_running", "billable", "hourly_rate", "created_at", "updated_at" FROM `time_entries`;--> statement-breakpoint
DROP TABLE `time_entries`;--> statement-breakpoint
ALTER TABLE `__new_time_entries` RENAME TO `time_entries`;--> statement-breakpoint
PRAGMA foreign_keys=ON;