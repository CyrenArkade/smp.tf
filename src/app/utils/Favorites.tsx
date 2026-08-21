'use client'
import { createContext, useEffect, useState, type ReactNode } from "react";

function defaultFavorites(): Set<string> {
  if (typeof localStorage !== 'undefined') {
    const item = localStorage.getItem('favorites') 
    if (item)
      return new Set( JSON.parse(item))
  }
  return new Set()
}

export const FavoriteContext = createContext({ favorites: new Set<string>(), toggleFavorite: (_: string) => {}})

export default function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState(new Set<string>())

  useEffect(() => {
    setFavorites(defaultFavorites())
  }, [])

  useEffect(() => {
    if (typeof localStorage !== 'undefined')
      localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)))
  }, [favorites])

  function toggleFavorite(name: string) {
    const new_favorites = new Set(favorites)
    if (favorites.has(name))
      new_favorites.delete(name)
    else
      new_favorites.add(name)

    setFavorites(new_favorites)
  }

  return (
    <FavoriteContext value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext>
  )
}

