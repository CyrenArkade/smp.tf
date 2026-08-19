import { fetchCreators } from "@/db/api";
import LiveMarker from "../utils/LiveMarker";
import FavoriteButton from "./FavoriteButton";

export default async function CreatorList() {
  const creators = await fetchCreators()

  return (
    <div className='bg-black/50 rounded-lg p-2 h-fit'>
      <h2 className='text-2xl text-center'>creators</h2>
      <hr className='my-2 border-light mx-8' />
      {creators.map(creator =>
        <a
          key={creator.id}
          href={creator.name}
          className='flex flex-row items-center gap-2 p-2 hover:scale-101 hover:bg-black/50 rounded-sm transition-all'
        >
          <img
            src={`skins/${creator.name}.png`}
            alt={`${creator.name}'s head`}
            className='w-[34px] [image-rendering:pixelated]'
          />
          <p className='mr-auto'>{creator.name}</p>
          <LiveMarker live={creator.live} />
          <FavoriteButton creator={creator} />
        </a>
      )}
    </div>
  )
}
