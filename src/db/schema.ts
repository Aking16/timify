import { relations, sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

// Projects table
export const projects = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#3b82f6"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Time entries table
export const timeEntries = sqliteTable("time_entries", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  title: text("title"),
  description: text("description"),
  startTime: integer("start_time", { mode: "timestamp" }).$defaultFn(() => new Date()),
  endTime: integer("end_time", { mode: "timestamp" }),
  duration: integer("duration"), // in seconds, calculated field
  isRunning: integer("is_running", { mode: "boolean" }).default(true),
  billable: integer("billable", { mode: "boolean" }).default(false),
  hourlyRate: real("hourly_rate"), // optional, can override project rate
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(() => new Date()),
});

// Tags table (for categorization)
export const tags = sqliteTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
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
export const usersRelations = relations(user, ({ many }) => ({
  projects: many(projects),
  timeEntries: many(timeEntries),
  tags: many(tags),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(user, { fields: [projects.userId], references: [user.id] }),
  timeEntries: many(timeEntries),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one, many }) => ({
  user: one(user, { fields: [timeEntries.userId], references: [user.id] }),
  project: one(projects, {
    fields: [timeEntries.projectId],
    references: [projects.id],
  }),
  tags: many(timeEntryTags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(user, { fields: [tags.userId], references: [user.id] }),
  timeEntries: many(timeEntryTags),
}));

export const timeEntryTagsRelations = relations(timeEntryTags, ({ one }) => ({
  timeEntry: one(timeEntries, {
    fields: [timeEntryTags.timeEntryId],
    references: [timeEntries.id],
  }),
  tag: one(tags, { fields: [timeEntryTags.tagId], references: [tags.id] }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
