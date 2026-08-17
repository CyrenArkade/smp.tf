import type { VodWithCreator } from "./App";
import CardCreator from "./CardCreator";

function timestampRelative(timestamp: Date): string {
  const ms = new Date().getTime() - timestamp.getTime()
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

export default function VodCard({ vod }: { vod: VodWithCreator }) {
  const is_live = vod.thumbnail.includes('live_user') // we love jank in this household :3

  return (
    <div className={'relative flex flex-row gap-4 bg-black/50 p-4 rounded-xl hover:scale-101 transition-transform'}>
      <a
        href={is_live ? `https://twitch.tv/${vod.creator.name}` : vod.url}
        className='absolute w-full h-full top-0 left-0'
      />
      <div className='relative min-w-[192px] min-h-[108px] pointer-events-none'>
        <img
          src={substituteThumbnail(vod.thumbnail, 192, 108)}
          alt='Video thumbnail'
          className='rounded-md'
        />
        {is_live &&
          <p className='absolute top-2 left-2 px-1 py-0.5 bg-red-500 rounded-sm text-xs font-bold uppercase'>Live</p>
        }
      </div>
      <div className='flex flex-col justify-between min-w-0 grow'>
        <h3 className='text-nowrap overflow-hidden text-ellipsis'>{vod.title}</h3>
        <div className='flex flex-row justify-between items-center gap-2 w-full'>
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
              {timestampRelative(vod.timestamp)}
            </p>
          </div>
          <CardCreator vod={vod} />
        </div>
      </div>
    </div>
  )
}
