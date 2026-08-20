'use client'
import type { Creator } from "@/db/schema";
import LiveMarker from "../utils/LiveMarker";
import FavoriteButton from "./FavoriteButton";
import Search from "@/app/assets/search.svg?react";
import { useEffect, useRef, useState } from "react";

export default function CreatorList({ creators }: { creators: Creator[] }) {
  const searchRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    function handleSlash(e: KeyboardEvent) {
      if (e.key == '/') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleSlash)
    return () => window.removeEventListener('keydown', handleSlash)
  }, [])

  function creatorSearch(creator: Creator) {
    return creator.name.toLowerCase().includes(search.toLowerCase())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == 'Escape')
      e.currentTarget.blur()
    else if (e.key == 'Enter') {
      const creator = creators.find(creatorSearch)
      if (creator) {
        history.pushState(null, '', `${creator.name}`)
        e.currentTarget.blur()
      }
    }
  }

  return (
    <div className='relative bg-black/50 rounded-lg p-2 h-fit max-h-60 lg:max-h-none overflow-scroll'>
      <div className='absolute top-3 left-2 w-8 h-8 rounded-full group focus-within:bg-light focus-within:w-[calc(100%-1rem)] transition-all'>
        <input
          ref={searchRef}
          className='w-full h-full outline-none px-3 pl-8 pr-2 rounded-full not-focus:text-transparent transition-all placeholder:text-neutral-200'
          value={search}
          placeholder='Search'
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={(e) => e.target.select()}
        />
        <Search
          className='absolute h-full w-8 top-0 left-0 p-1 cursor-pointer transition-all not-group-focus-within:hover:bg-white/20 rounded-full'
          onMouseDown={e => {
            e.preventDefault()
            searchRef.current?.focus()
          }}
          onTouchStart={e => {
            e.preventDefault()
            searchRef.current?.focus()
          }}
        />
      </div>
      <h2 className='text-2xl text-center'>creators</h2>
      <hr className='my-2 border-light mx-8' />
      {creators.filter(creatorSearch).map(creator =>
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
