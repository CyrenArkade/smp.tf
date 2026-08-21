import { fetchVods } from "@/db/api";
import Vod from "./Vod";
import ListTitle from "./ListTitle";

export default async function VodList({ creators, flightOnly }: { creators: 'all' | string[], flightOnly: boolean }) {
  const vods = await fetchVods({
    creators: creators === 'all' ? undefined : creators,
    flight: flightOnly ? true : undefined,
  })

  return (
    <div className='w-full space-y-2 sm:space-y-2'>
      <ListTitle creators={creators} />
      {vods.length == 0
        ? <div className='w-full bg-black/50 rounded-xl py-8 space-y-4'>
          <h3 className='text-center text-3xl'>there's nothing here</h3>
          <p className='text-center text-xl'>not even Jibble ;-;</p>
        </div>
        : vods.map((vod, i) =>
          <Vod key={creators + vod.id + flightOnly} vod={vod} i={i} />
        )}
    </div>
  )
}
