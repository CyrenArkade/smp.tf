'use client'
import type { VodWithCreator } from "../App";
import FavoriteButton from "@/app/creators/FavoriteButton";

export default function VodAttribution({ vod }: { vod: VodWithCreator }) {

  return (
    <a
      href={vod.creator.name}
      className='flex flex-row sm:p-1 sm:pl-2 hover:bg-black/50 hover:scale-102 rounded-md gap-2 sm:gap-4 transition-all z-10'
    >
      <div className='self-center flex flex-col items-end'>
        <p className='text-md sm:text-lg'>{vod.creator.name}</p>
        <FavoriteButton creator={vod.creator} className='hidden sm:inline' />
      </div>
      <img
        src={`skins/${vod.creator.name}.png`}
        alt={`${vod.creator.name}'s head`}
        className='h-[34px] sm:h-[68px] aspect-square [image-rendering:pixelated]'
      />
    </a>
  )
}
