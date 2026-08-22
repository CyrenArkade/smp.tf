'use client'
import { useEffect, useState } from "react";
import type { VodWithCreator } from "../App";
import LiveMarker from "../utils/LiveMarker";
import VodAttribution from "./VodAttribution";
import { clsx } from "clsx";

function timestampRelative(timestamp: Date, duration: number): string {
  const ms = new Date().getTime() - timestamp.getTime() - duration * 1000
  const min = ms / (60 * 1000)
  const hours = min / 60
  const days = hours / 24

  if (days > 1)
    return Math.floor(days) + 'd ago'
  else if (hours > 1)
    return Math.floor(hours) + 'h ago'
  else
    return Math.floor(Math.max(min, 1)) + 'm ago'
}

function timestampIso(timestamp: Date): string {
  const pad = (n: number) => ('0' + n).slice(-2);

  return timestamp.getFullYear() + '-' +
    pad(timestamp.getMonth()+1)  + '-' +
    pad(timestamp.getDate())     + ' ' +
    pad(timestamp.getHours())    + ':' +
    pad(timestamp.getMinutes())  + ':' +
    pad(timestamp.getSeconds())
}

function formatDuration(duration: number): string {
  const pad = (n: number) => ('0' + n).slice(-2);

  const s = duration % 60
  const m = Math.floor(duration / 60) % 60
  const h = Math.floor(duration / 3600)

  return `${h}:${pad(m)}:${pad(s)}`
}

function substituteThumbnail(thumbnail: string, w: number, h: number): string {
  return thumbnail
    .replace('%{width}', String(w))
    .replace('%{height}', String(h))
    .replace('{width}', String(w))
    .replace('{height}', String(h))
}

export default function Vod({ vod, i }: { vod: VodWithCreator, i: number }) {
  const isLive = vod.thumbnail.includes('live_user') // we love jank in this household :3
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  const vodLink = isLive ? `https://twitch.tv/${vod.creator.name}` : vod.url

  return (
    <div
      className={clsx(
        'relative flex flex-row gap-2 bg-black/50 p-2 rounded-xl hover:scale-101',
        visible ? 'opacity-100' : 'opacity-0 translate-x-3'
      )}
      style={{
        transition: `scale 150ms, opacity 300ms ${Math.floor(Math.log(i+1) * 150)}ms linear, translate 300ms ${Math.floor(Math.log(i+1) * 150)}ms`
      }}
    >
      <a
        href={vodLink}
        className='absolute inset-0'
      />
      <div
        className='relative grow-0 bg-contain bg-no-repeat rounded-md min-w-[160px] min-h-[90px] sm:min-w-[224px] sm:min-h-[126px] pointer-events-none'
        style={{ backgroundImage: `url(${substituteThumbnail(vod.thumbnail, 224, 126)})`}}
      >
        <LiveMarker live={isLive} className='absolute top-2 left-2' />
      </div>
      <div className='flex flex-col justify-between min-w-0 grow p-1 sm:p-2'>
        <h3
          onClick={() => window.location.href = vodLink}
          title={vod.title}
          className={clsx(
            'cursor-pointer z-10 text-md sm:text-lg overflow-hidden leading-5 sm:leading-normal',
            '[display:-webkit-box] [-webkit-line-clamp:2] sm:[-webkit-line-clamp:1] [-webkit-box-orient:vertical]',
          )}
        >
          {vod.title}
        </h3>
        <div className='flex flex-row justify-between items-end gap-2 w-full text-sm sm:text-lg'>
          <div
            className='cursor-pointer z-10'
            onClick={() => window.location.href = vodLink}
            title={timestampIso(vod.timestamp)}
          >
            <p className='text-neutral-300 leading-4 mt-1'>
              {formatDuration(vod.duration)}
            </p>
            <p className='text-neutral-300'>
              {isLive ? 'now!' : timestampRelative(vod.timestamp, vod.duration)}
            </p>
          </div>
          <VodAttribution vod={vod} />
        </div>
      </div>
    </div>
  )
}
