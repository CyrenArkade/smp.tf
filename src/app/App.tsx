import * as sch from "@/db/schema";
import FavoritesProvider from "./utils/favorites";
import VodList from "./vods/VodList";
import Client from "./Client";
import flightLogo from "@/app/assets/flight-logo.png";
import CreatorList from "./creators/CreatorList";
import VodFilter from "./vods/VodFilter";
import { parsePathType } from "./utils/routing";

export type VodWithCreator = sch.Vod & { creator: sch.Creator }

export default async function App({ url }: { url: URL }) {
  const path = parsePathType(url.pathname)
  const creators =
    path === 'all'
      ? 'all'
    : path === 'favorites'
      ? (url.searchParams.get('creators') ?? '').split(',')
    : [url.pathname.slice(1)]

  return (
    <FavoritesProvider>
      <div className='max-w-5xl mx-auto p-1 pb-16'>
        <img src={flightLogo} alt='The Flight logo' className='w-md mx-auto' />
        <div className='flex flex-col lg:flex-row gap-4'>
          <div className='space-y-4 px-4 lg:px-0'>
            <VodFilter url={url.toString()} />
            <CreatorList />
          </div>
          <VodList creators={creators} />
        </div>
      </div>
      <Client pathname={url.pathname} />
    </FavoritesProvider>
  )
}
