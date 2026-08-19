'use client'
import { useContext } from "react";
import { FavoriteContext } from "../utils/favorites";
import FilterGroup from "../utils/FilterGroup";
import { parsePathType } from "../utils/routing";

export default function VodFilter({ url: string_url }: { url: string }) {
  const url = new URL(string_url)
  const pathType = parsePathType(url.pathname)
  const { favorites } = useContext(FavoriteContext)

  const favoriteParams = new URLSearchParams()
  favoriteParams.set('creators', Array.from(favorites).join(','))

  return (
    <div className='flex flex-col p-4 gap-1 rounded-lg bg-black/50'>
      <h3 className='text-xl text-center'>filter creators</h3>
      <FilterGroup
        options={[
          { label: 'all', href: '/' },
          { label: 'favorites', href: `/multi?${favoriteParams.toString()}`},
          {
            label: 'one',
            disabled: pathType != 'one',
            href: url.pathname,
          },
        ]}
        selected={pathType}
        className='mx-auto'
      />
      <h3 className='text-xl text-center pt-4'>filter content</h3>
      <FilterGroup
        options={[
          { label: 'flight', href: '/' },
          { label: 'all', href: `/multi?${favoriteParams.toString()}`},
        ]}
        selected={pathType}
        className='mx-auto'
      />
    </div>
  )
}
