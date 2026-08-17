'use client'
import type { VodWithCreator } from "./App";
import Favorite from "@/app/assets/favorite.svg?react";
import FavoriteFilled from "@/app/assets/favorite-filled.svg?react";
import { useContext } from "react";
import { FavoriteContext } from "./utils/favorites";

export default function CardCreator({ vod }: { vod: VodWithCreator }) {
  const { favorites, toggleFavorite } = useContext(FavoriteContext)

  return (
    <a
      href={vod.creator.name}
      className='flex flex-row p-1 pl-2 hover:bg-black/50 hover:scale-102 rounded-md gap-4 transition-all z-10'
    >
      <div className='flex flex-col items-end'>
        <p className='text-lg'>{vod.creator.name}</p>
        <button
          onClick={e => {
            toggleFavorite(vod.creator.name)
            e.stopPropagation()
            e.preventDefault()
          }}
          className='cursor-pointer text-light'
        >
          {favorites.has(vod.creator.name)
            ? <FavoriteFilled className='h-9 w-9' />
            : <Favorite className='h-9 w-9' />
          }
        </button>
      </div>
      <img
        src={`${vod.creator.name}.png`}
        alt={`${vod.creator.name}'s head`}
        className='h-[68px] aspect-square [image-rendering:pixelated]'
      />
    </a>
  )
}
