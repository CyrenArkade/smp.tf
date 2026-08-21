'use client'
import Favorite from "@/app/assets/favorite.svg?react";
import FavoriteFilled from "@/app/assets/favorite-filled.svg?react";
import { useContext } from "react";
import { FavoriteContext } from "../utils/Favorites";
import type { Creator } from "@/db/schema";
import { clsx } from "clsx";

export default function FavoriteButton({ creator, className }: { creator: Creator, className?: string }) {
  const { favorites, toggleFavorite } = useContext(FavoriteContext)

  return (
    <button
      onClick={e => {
        toggleFavorite(creator.name)
        e.stopPropagation()
        e.preventDefault()
      }}
      className={clsx('relative cursor-pointer text-light favorite-button group', className)}
    >
      <span className='absolute inset-0 group-hover:bg-white/20 rounded-full group-hover:scale-115 transition-all' />
      {favorites.has(creator.name)
        ? <FavoriteFilled className='h-9 w-9 translate-y-0.5' />
        : <Favorite className='h-9 w-9 translate-y-0.5' />
      }
    </button>
  )
}
