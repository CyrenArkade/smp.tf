import { defineRelations } from "drizzle-orm/relations";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const creator = sqliteTable('creator', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  twitchId: text(),
  live: int({ mode: 'boolean' }).notNull(),
})
export type Creator = typeof creator.$inferSelect

export const vod = sqliteTable('vod', {
  id: text().primaryKey(),
  creator_id: int().notNull().references(() => creator.id),
  title: text().notNull(),
  thumbnail: text().notNull(),
  timestamp: int({ mode: 'timestamp' }).notNull(),
  duration: int().notNull(),
  url: text().notNull(),
  flight: int({ mode: 'boolean' }),
})
export type Vod = typeof vod.$inferSelect

export const relations = defineRelations({ creator, vod }, r => ({
  vod: {
    creator: r.one.creator({
      optional: false,
      from: r.vod.creator_id,
      to: r.creator.id,
    }),
  },
  creator: {
    vod: r.many.vod()
  },
}))

