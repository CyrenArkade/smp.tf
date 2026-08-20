'use client'
import { useContext } from "react";
import { FavoriteContext } from "../utils/favorites";
import FilterGroup from "../utils/FilterGroup";
import { parsePathType } from "../utils/routing";

export default function VodFilter({ url: string_url }: { url: string }) {
  const url = new URL(string_url)
  const pathType = parsePathType(url.pathname)
  const { favorites } = useContext(FavoriteContext)

  return (
    <div className='flex flex-row flex-wrap p-4 pt-2 gap-1 lg:gap-3 justify-evenly rounded-lg bg-black/50'>
      <div>
        <h3 className='text-xl text-center'>filter creators</h3>
        <FilterGroup
          options={[
            { label: 'all', pathname: '/' },
            {
              label: 'favorites',
              pathname: '/multi',
              params: { creators: Array.from(favorites).join(',') }
            },
          ]}
          defaultParams={{ creators: undefined }}
          selected={pathType == 'one' ? undefined : pathType}
          className='mx-auto'
        />
      </div>
      <div>
        <h3 className='text-xl text-center'>filter content</h3>
        <FilterGroup
          options={[
            {
              label: 'flight only',
              params: { content: undefined },
            },
            {
              label: 'all',
              params: { content: 'all' },
            },
          ]}
          selected={url.searchParams.has('content') ? 'all' : 'flight only'}
          className='mx-auto'
        />
      </div>
    </div>
  )
}
