import { ApiClient } from "@twurple/api";
import { AppTokenAuthProvider } from "@twurple/auth";
import * as sch from "@/db/schema";
import db, { updateCols } from "@/db/db";
import { eq, sql } from "drizzle-orm";

const twitchClientId = process.env.TWITCH_CLIENT_ID!
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET!

export const twitch = new ApiClient({
  authProvider: new AppTokenAuthProvider(twitchClientId, twitchClientSecret)
})

async function update_creator(creator: sch.Creator, online: boolean) {
  if (!creator.twitchId)
    return

  const stream = await twitch.streams.getStreamByUserId(creator.twitchId)
  await db.update(sch.creator)
    .set({ live: Boolean(stream) })
    .where(eq(sch.creator.id, creator.id))

  const latestTrackedVod = await db.query
    .vod
    .findFirst({
      orderBy: t => sql`${t.timestamp} desc`,
      where: {
        creator_id: creator.id,
      }
    })

  for await (const vod of twitch.videos.getVideosByUserPaginated(creator.twitchId)) {
    if (vod.type != 'archive')
      continue
    if (latestTrackedVod && (latestTrackedVod.timestamp.getTime() - 24 * 3600 * 1000) > vod.creationDate.getTime())
      break

    const liveVod = vod.streamId == stream?.id
    await db.insert(sch.vod)
      .values({
        id: vod.id,
        title: vod.title,
        thumbnail: liveVod ? stream!.thumbnailUrl : vod.thumbnailUrl,
        timestamp: vod.creationDate,
        duration: vod.durationInSeconds,
        live: liveVod,
        url: vod.url,
        creator_id: creator.id,
        flight: vod.title.toLowerCase().includes('flight') || (liveVod && online),
      })
      .onConflictDoUpdate({
        target: sch.vod.id,
        set: {
          ...updateCols(sch.vod, ['thumbnail', 'duration', 'live']),
          title: liveVod ? stream!.title : sql.raw(`excluded.${sch.vod.title.name}`),
          flight: sql.raw(`flight OR excluded.${sch.vod.flight.name}`),
        }
      })
  }
}

export async function updateTwitch(onlinePlayers: string[]) {
  const creators = await db.select().from(sch.creator);

  await Promise.all(creators.map(creator =>
    update_creator(creator, onlinePlayers.includes(creator.minecraftName))
  ))
}

