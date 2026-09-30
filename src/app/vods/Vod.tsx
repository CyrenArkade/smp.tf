'use client'
import { useEffect, useState } from "react";
import type { VodWithCreator } from "@/db/api.ts";
import LiveMarker from "@/app/utils/LiveMarker";
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

function useVodTimestamps(vod: VodWithCreator): string | undefined {
  const [title, setTitle] = useState<string | undefined>(undefined)

  const pad = (n: number) => ('0' + n).slice(-2)

  function format(timestamp: Date) {
    return timestamp.getFullYear() + '-' +
      pad(timestamp.getMonth()+1)  + '-' +
      pad(timestamp.getDate())     + ' ' +
      pad(timestamp.getHours())    + ':' +
      pad(timestamp.getMinutes())  + ':' +
      pad(timestamp.getSeconds())
  }

  useEffect(() => {
    setTitle([
      format(vod.timestamp),
      'to',
      format(new Date(vod.timestamp.getTime() + vod.duration * 1000)),
    ].join('\n'))
  }, [])

  return title
}

function formatDuration(duration: number): string {
  const date = new Date(duration * 1000)
  const pad = (n: number) => ('0' + n).slice(-2);

  return `${date.getUTCHours()}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
}

function substituteThumbnail(thumbnail: string, w: number, h: number): string {
  return thumbnail
    .replace('%{width}', String(w))
    .replace('%{height}', String(h))
    .replace('{width}', String(w))
    .replace('{height}', String(h))
}

export function vodLink(vod: VodWithCreator, time: number | undefined) {
  if (vod.live && !time)
    return `https://twitch.tv/${vod.creator.name}`
  else if (!time)
    return vod.url
  else {
    const date = new Date(time * 1000 - vod.timestamp.getTime())
    return `${vod.url}?t=${date.getUTCHours()}h${date.getUTCMinutes()}m${date.getUTCSeconds()}s`
  }
}

export default function Vod({ vod, i, syncTime }: { vod: VodWithCreator, i: number, syncTime: number | undefined }) {
  const [visible, setVisible] = useState(false)
  const vodTimestamps = useVodTimestamps(vod)

  useEffect(() => {
    setVisible(true)
  }, [])

  const link = vodLink(vod, syncTime)

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
        href={link}
        className='absolute inset-0'
      />
      {syncTime &&
        <span className='absolute inset-0 bg-white/5 rounded-l-xl h-full pointer-events-none' style={{ width: `${(syncTime - vod.timestamp.getTime() / 1000) / vod.duration * 100}%` }} />
      }
      <div
        className='relative grow-0 bg-contain bg-no-repeat rounded-md min-w-[160px] min-h-[90px] sm:min-w-[224px] sm:min-h-[126px] pointer-events-none'
        style={{ backgroundImage: `url(${substituteThumbnail(vod.thumbnail, 224, 126)})`}}
      >
        <LiveMarker live={vod.live} className='absolute top-2 left-2' />
      </div>
      <div className='flex flex-col justify-between min-w-0 grow p-1 sm:p-2'>
        <a
          href={link}
          title={vod.title}
          className='z-10'
          tabIndex={-1}
        >
          <h3
            className={clsx(
              'cursor-pointer text-md sm:text-lg overflow-hidden leading-5 sm:leading-normal',
              '[display:-webkit-box] [-webkit-line-clamp:2] sm:[-webkit-line-clamp:1] [-webkit-box-orient:vertical]',
            )}
          >
            {vod.title}
          </h3>
        </a>
        <div className='flex flex-row justify-between items-end gap-2 w-full text-sm sm:text-lg'>
          <a
            className='cursor-pointer z-10'
            href={link}
            title={vodTimestamps}
            tabIndex={-1}
          >
            <p className='text-neutral-300 leading-4 mt-1'>
              {formatDuration(vod.duration)}
            </p>
            <p className='text-neutral-300'>
              {vod.live ? 'now!' : timestampRelative(vod.timestamp, vod.duration)}
            </p>
          </a>
          <VodAttribution vod={vod} />
        </div>
      </div>
    </div>
  )
}
