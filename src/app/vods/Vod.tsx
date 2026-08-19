import type { VodWithCreator } from "../App";
import LiveMarker from "../utils/LiveMarker";
import VodAttribution from "./VodAttribution";

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

export default function Vod({ vod, includeAttribution }: { vod: VodWithCreator, includeAttribution?: boolean }) {
  const is_live = vod.thumbnail.includes('live_user') // we love jank in this household :3

  return (
    <div className={'relative flex flex-row gap-2 bg-black/50 p-2 rounded-xl hover:scale-101 transition-transform'}>
      <a
        href={is_live ? `https://twitch.tv/${vod.creator.name}` : vod.url}
        className='absolute inset-0'
      />
      <div
        className='relative grow-0 bg-contain bg-no-repeat rounded-md min-w-[160px] min-h-[90px] sm:min-w-[224px] sm:min-h-[126px] pointer-events-none'
        style={{ backgroundImage: `url(${substituteThumbnail(vod.thumbnail, 224, 126)})`}}
      >
        <LiveMarker live={is_live} className='absolute top-2 left-2' />
      </div>
      <div className='flex flex-col justify-between min-w-0 grow p-1 sm:p-2'>
        <h3 className='overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] sm:[-webkit-line-clamp:1] [-webkit-box-orient:vertical] leading-5 sm:leading-normal'>{vod.title}</h3>
        <div className='flex flex-row justify-between items-end gap-2 w-full'>
          <div>
            <p
              className='text-neutral-300 leading-4 mt-1'
            >
              {formatDuration(vod.duration)}
            </p>
            <p
              title={timestampIso(vod.timestamp)}
              className='text-neutral-300'
            >
              {timestampRelative(vod.timestamp, vod.duration)}
            </p>
          </div>
          {includeAttribution &&
            <VodAttribution vod={vod} />
          }
        </div>
      </div>
    </div>
  )
}
