import { and, desc, eq, getColumns, gt, sql } from "drizzle-orm";
import db from "./db";
import * as sch from "@/db/schema";

export type VodWithCreator = sch.Vod & { creator: sch.Creator }

type VodFilter = {
  creators?: string[],
  flight?: boolean,
  vod?: string,
  at?: number,
}

export async function fetchVods(filter?: VodFilter): Promise<{ vods: VodWithCreator[], syncTime: number | undefined }> {
  const syncTime = filter?.at
    ? filter.at + (filter?.vod
      ? (await db.query.vod.findFirst({ where: { id: filter?.vod } }))!.timestamp.getTime() / 1000
      : 0)
    : undefined

  return {
    syncTime: syncTime,
    vods: await db.query.vod.findMany({
      // live (most recent start first) then offline (most recent end first)
      orderBy: t => sql`
        CASE WHEN ${t.live} THEN 1 ELSE 0 END DESC,
        CASE WHEN ${t.live} THEN ${t.timestamp} ELSE ${t.timestamp} + ${t.duration} END DESC
      `,
      with: {
        creator: true,
      },
      where: {
        creator: !filter?.creators ? undefined : { name: { in: filter.creators } },
        flight: filter?.flight,
        RAW: syncTime
          ? t => sql`${t.timestamp} <= ${syncTime} AND ${syncTime} < ${t.timestamp} + ${t.duration}`
          : undefined
      },
      limit: 50,
    })
  }
}

export async function fetchCreators() {
  return await db
    .select({ ...getColumns(sch.creator) })
    .from(sch.creator)
    .leftJoin(sch.vod, and(
      eq(sch.vod.creator_id, sch.creator.id),
      eq(sch.vod.flight, true),
      gt(sch.vod.timestamp, new Date(new Date().getTime() - 60*24*60*60*1000)), // last 60 days
    ))
    .groupBy(sch.creator.id)
    .orderBy(
      desc(sql`coalesce(sum(${sch.vod.duration}), 0)`)
    )
}

