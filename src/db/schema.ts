import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const states = sqliteTable("states", {
    id: text("id").primaryKey(),
    countryId: text("country_id").notNull(),
    name: text("name").notNull(),
    longitude: text("longitude").notNull(),
    latitude: text("latitude").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date()),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});