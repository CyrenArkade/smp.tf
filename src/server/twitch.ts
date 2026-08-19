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

async function update_creator(creator: sch.Creator) {
  console.log('updating', creator.name)
  if (!creator.twitchId)
    return

  const stream = await twitch.streams.getStreamByUserId(creator.twitchId)
  await db.update(sch.creator)
    .set({ live: Boolean(stream) })
    .where(eq(sch.creator.id, creator.id))

  const latest_tracked_vod = await db.query
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
    if (latest_tracked_vod && latest_tracked_vod.timestamp > vod.creationDate)
      break

    await db.insert(sch.vod)
      .values({
        id: vod.id,
        title: vod.title,
        thumbnail: vod.streamId == stream?.id ? stream!.thumbnailUrl : vod.thumbnailUrl,
        timestamp: vod.creationDate,
        duration: vod.durationInSeconds,
        url: vod.url,
        creator_id: creator.id,
        flight: vod.title.toLowerCase().includes('flight'),
      })
      .onConflictDoUpdate({
        target: sch.vod.id,
        set: {
          ...updateCols(sch.vod, ['title', 'thumbnail', 'duration']),
          flight: sql.raw(`flight OR excluded.${sch.vod.flight.name}`),
        }
      })
  }
}

export async function update_twitch() {
  const creators = await db.select().from(sch.creator);
  for (const creator of creators)
    await update_creator(creator);
}

