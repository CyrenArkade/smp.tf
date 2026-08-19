import { and, desc, eq, getColumns, sql } from "drizzle-orm";
import db from "./db";
import * as sch from "@/db/schema";

type VodFilter = {
  creators?: string[],
  flight?: boolean,
}

export async function fetchVods(filter?: VodFilter) {
  return await db.query.vod.findMany({
    orderBy: t => sql`${t.timestamp} + ${t.duration} desc`,
    with: {
      creator: true,
    },
    where: {
      creator: !filter?.creators ? undefined : { name: { in: filter.creators } },
      flight: filter?.flight,
    },
    limit: 100,
  })
}

export async function fetchCreators() {
  return await db
    .select({ ...getColumns(sch.creator) })
    .from(sch.creator)
    .leftJoin(sch.vod, and(
      eq(sch.vod.creator_id, sch.creator.id),
      eq(sch.vod.flight, true)
    ))
    .groupBy(sch.creator.id)
    .orderBy(
      desc(sql`coalesce(sum(${sch.vod.duration}), 0)`)
    )
}

