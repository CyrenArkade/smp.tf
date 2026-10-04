'use client'
import { useContext, useRef, useState } from "react";
import { FavoriteContext } from "@/app/utils/Favorites";
import FilterGroup from "@/app/utils/FilterGroup";
import { parsePathType } from "@/app/utils/routing";
import calendar from "@/app/assets/calendar.svg";

export default function VodFilter({ url: string_url }: { url: string }) {
  const url = new URL(string_url)
  const pathType = parsePathType(url.pathname)
  const { favorites } = useContext(FavoriteContext)

  const timeFilterRef = useRef<HTMLInputElement>(null)
  const [timeFilter, setTimeFilter] = useState('')

  function timeFilterTutorial() {
    window.alert([
      'To get a vod link, use Settings > Copy Video URL in the player:',
      'https://www.twitch.tv/videos/2889869749?t=1h23m53s',
      '',
      'To select a time, click the calendar icon.',
      '',
      'Alternatively, use this bookmarklet while on a vod:',
      'https://github.com/CyrenArkade/smp.tf/blob/main/scripts/sync.js',
    ].join('\n'))
  }

  function applyTimeFilter(filter?: string) {
    filter ??= timeFilter

    const newUrl = new URL(url)
    if (Date.parse(filter)) {
      newUrl.searchParams.set('at', (Date.parse(filter) / 1000).toString())
      newUrl.searchParams.delete('vod')
    }
    else if (filter.includes('twitch.tv/videos')) {
      const vod = filter.match(/videos\/(\d+)/)?.[1]
      const at = new URL(filter)
        .searchParams
        .get('t')                                         // get ex. ?t=1h4m5s
        ?.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/)      // match <hr>h<min>m<sec>s
        ?.slice(1)                                        // get [hr, min, sec]
        .reduce((acc, x) => acc * 60 + Number(x ?? 0), 0) // compute sec + 60 * (min + 60 * (hr))

      if (!vod)
        return
      else if (!at) {
        timeFilterTutorial()
        return
      }

      newUrl.searchParams.set('vod', vod)
      newUrl.searchParams.set('at', at.toString())
    }
    else if (!timeFilter) {
      newUrl.searchParams.delete('vod')
      newUrl.searchParams.delete('at')
    }
    else {
      timeFilterTutorial()
    }

    history.pushState(null, '', `${newUrl.pathname}?${newUrl.searchParams}`)
  }

  return (
    <div className='p-4 pt-2 rounded-lg space-y-4 bg-black/50'>
      <div className='flex flex-row flex-wrap gap-3 justify-evenly'>
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
            keepParams={['content', 'vod', 'at']}
            selected={pathType == 'one' ? undefined : pathType}
            className='mx-auto'
          />
        </div>
        <div>
          <h3 className='text-xl text-center'>filter content</h3>
          <FilterGroup
            options={[
              { label: 'flight only' },
              { label: 'all', params: { content: 'all' } },
            ]}
            keepParams={['creators', 'vod', 'at']}
            selected={url.searchParams.has('content') ? 'all' : 'flight only'}
            className='mx-auto'
          />
        </div>
      </div>
      <div className='flex flex-row h-8 rounded-full bg-white/10 transition-all group focus-within:bg-light'>
        <input
          ref={timeFilterRef}
          value={timeFilter}
          onChange={e => setTimeFilter(e.target.value)}
          onKeyDown={e => e.key == 'Enter' && applyTimeFilter()}
          placeholder='Enter vod or select time'
          className='block min-w-0 outline-none px-4 placeholder:text-neutral-200'
        />
        <span className='datepicker-input-wrapper shrink-0 right-2 top-1 w-6 h-6' style={{ background: `url("${calendar}")` }}>
          <input type='datetime-local' onChange={e => {
            setTimeFilter(new Date(Date.parse(e.target.value)).toLocaleString())
            applyTimeFilter(e.target.value)
          }} />
        </span>
      </div>
    </div>
  )
}
