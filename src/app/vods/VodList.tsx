'use client'
import Vod, { vodLink } from "./Vod";
import type { VodWithCreator } from "../App";
import { useEffect, useState } from "react";

export default function VodList({ vods }: { vods: VodWithCreator[] }) {
  const [focusIndex, setFocusIndex] = useState<number | undefined>(undefined)

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (document.activeElement?.tagName == 'INPUT' || vods.length == 0)
        return

      let direction
      if (e.key == 'j' || e.key == 'ArrowDown')
        direction = 1
        else if (e.key == 'k' || e.key == 'ArrowUp')
          direction = -1
        else
          return

      setFocusIndex(focusIndex => Math.min(Math.max(0, (focusIndex ?? -direction) + direction), vods.length-1))
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  useEffect(() => {
    if (focusIndex == undefined)
      return
    (document.querySelector(`a[href="${vodLink(vods[focusIndex])}"]`) as HTMLElement | undefined)?.focus()
  }, [focusIndex])

  return (
    <div className='w-full space-y-2 sm:space-y-2'>
      {vods.length == 0
        ? <div className='w-full bg-black/50 rounded-xl py-8 space-y-4'>
          <h3 className='text-center text-3xl'>there's nothing here</h3>
          <p className='text-center text-xl'>not even Jibble ;-;</p>
        </div>
        : vods.map((vod, i) =>
          <Vod key={i} vod={vod} i={i} />
        )}
    </div>
  )
}
