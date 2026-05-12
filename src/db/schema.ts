import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Users table (extends NextAuth or your auth system)
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Projects table
export const projects = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#3b82f6"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Time entries table
export const timeEntries = sqliteTable("time_entries", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  description: text("description"),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }),
  duration: integer("duration"), // in seconds, calculated field
  isRunning: integer("is_running", { mode: "boolean" }).default(false),
  billable: integer("billable", { mode: "boolean" }).default(false),
  hourlyRate: real("hourly_rate"), // optional, can override project rate
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(
    () => new Date(),
  ),
});

// Tags table (for categorization)
export const tags = sqliteTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").default("#9ca3af"),
});

// Many-to-many: Time entries ↔ Tags
export const timeEntryTags = sqliteTable("time_entry_tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  timeEntryId: text("time_entry_id")
    .notNull()
    .references(() => timeEntries.id, { onDelete: "cascade" }),
  tagId: text("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
});

// Relations for TypeScript type safety
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  timeEntries: many(timeEntries),
  tags: many(tags),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  timeEntries: many(timeEntries),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one, many }) => ({
  user: one(users, { fields: [timeEntries.userId], references: [users.id] }),
  project: one(projects, {
    fields: [timeEntries.projectId],
    references: [projects.id],
  }),
  tags: many(timeEntryTags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, { fields: [tags.userId], references: [users.id] }),
  timeEntries: many(timeEntryTags),
}));

export const timeEntryTagsRelations = relations(timeEntryTags, ({ one }) => ({
  timeEntry: one(timeEntries, {
    fields: [timeEntryTags.timeEntryId],
    references: [timeEntries.id],
  }),
  tag: one(tags, { fields: [timeEntryTags.tagId], references: [tags.id] }),
}));
