import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    discordId: varchar("discord_id").unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersEconomyTable = pgTable("users_economy", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .references(() => usersTable.id)
        .unique(),
    crystals: integer("crystals").default(0),
    fates: integer("fates").default(0),
});

export const usersProgressionTable = pgTable("users_progression", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .references(() => usersTable.id)
        .unique(),
    level: integer("level").default(1),
    xp: integer("xp").default(0),
});
