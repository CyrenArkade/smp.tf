import { fetchVods } from "@/db/api";
import Vod from "./Vod";

export default async function VodList({ creators }: { creators: 'all' | string[] }) {
  const vods = await fetchVods({
    creators: creators === 'all' ? undefined : creators,
    flight: true,
  })

  return (
    <div className='space-y-2 sm:space-y-2'>
      {vods.map(vod =>
        <Vod key={vod.id} vod={vod} includeAttribution={creators === 'all' || creators.length > 1} />
      )}
    </div>
  )
}
