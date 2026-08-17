import db from "@/db/db";
import VodCard from "./VodCard";
import { sql } from "drizzle-orm";

export default async function App() {
  const vods = await db.query.vod.findMany({
    orderBy: t => sql`${t.timestamp} + ${t.duration} desc`,
    with: {
      creator: true,
    },
    limit: 100,
  })

  return (
    <div className='max-w-3xl mx-auto space-y-4 py-10'>
      {vods.filter(vod => vod.flight).map(vod =>
        <VodCard key={vod.id} vod={vod} />
      )}
    </div>
  )
}
