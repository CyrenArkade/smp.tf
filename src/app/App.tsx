import * as sch from "@/db/schema";
import FavoritesProvider from "./utils/Favorites";
import VodList from "./vods/VodList";
import Client from "./Client";
import flightLogo from "@/app/assets/flight-logo.png";
import CreatorList from "./creators/CreatorList";
import VodFilter from "./vods/VodFilter";
import { parsePathType } from "./utils/routing";
import { fetchCreators } from "@/db/api";
import Git from "@/app/assets/git.svg?react";

export type VodWithCreator = sch.Vod & { creator: sch.Creator }

export default async function App({ url }: { url: URL }) {
  const pathType = parsePathType(url.pathname)
  const creators =
    pathType === 'all'
      ? 'all'
    : pathType === 'favorites'
      ? (url.searchParams.get('creators') ?? '').split(',')
    : [url.pathname.slice(1)]
  const flightOnly = url.searchParams.get('content') != 'all'

  const allCreators = await fetchCreators()

  return (
    <FavoritesProvider>
      <a
        href='https://theflightsmp.store/'
        target='_blank'
        className='flex items-center justify-center w-full h-12 text-2xl bg-[#9454ee] underline'
      >
        <h1>GET YOUR JIBBLE HERE</h1>
      </a>
      <div className='max-w-5xl mx-auto px-1'>
        <div className='pb-16 pt-[min(4rem,10%)] min-h-screen'>
          <img
            src={flightLogo}
            alt='The Flight logo'
            className='max-w-[min(60%,424px)] aspect-1696/616 mx-auto [image-rendering:pixelated]'
          />
          <p className='font-ruinic text-3xl sm:text-4xl text-center pt-4 pb-6'>unofficial content tracker</p>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex flex-col-reverse lg:flex-col mx-auto gap-4 px-4 lg:px-0 min-w-72 max-w-md'>
              <VodFilter url={url.toString()} />
              <CreatorList creators={allCreators} />
            </div>
            <VodList creators={creators} flightOnly={flightOnly} />
          </div>
        </div>
        <div className='flex flex-row items-center justify-between w-full h-12 bg-black/50 mb-8 rounded-full'>
          <p className='px-6 text-lg'>made with {'<'}3</p>
          <a className='px-3' href='https://github.com/CyrenArkade/smp.tf'>
            <Git className='w-6 h-6' />
          </a>
        </div>
      </div>
      <Client />
    </FavoritesProvider>
  )
}
