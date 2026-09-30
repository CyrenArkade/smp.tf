'use client'
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import Link from "@/app/utils/Link";

type FilterGroupProps = {
  options: {
    label: string,
    pathname?: string,
    params?: Record<string, string>,
  }[],
  keepParams?: string[],
  selected: string | undefined,
  className?: string,
}
export default function FilterGroup({ options, selected: externalSelected, className, keepParams = [] }: FilterGroupProps) {
  const marker = useRef(null)
  const buttons = useRef<(HTMLAnchorElement | null)[]>([])
  const [selected, setSelected] = useState(externalSelected)
  const [markerStyle, setMarkerStyle] = useState({})

  const selectedIndex = options.findIndex(option => option.label == selected)

  useEffect(() => {
    if (selectedIndex == -1)
      setMarkerStyle({ ...markerStyle, backgroundColor: 'transparent' })
    else
      setMarkerStyle({
        ...markerStyle,
        left: buttons.current[selectedIndex]?.offsetLeft,
        width: buttons.current[selectedIndex]?.clientWidth,
        backgroundColor: undefined,
      })
  }, [selectedIndex])

  useEffect(() => {
    setSelected(externalSelected)
  }, [externalSelected])

  return (
    <div className={clsx('relative flex flex-row bg-white/10 z-10 rounded-full w-fit overflow-clip', className)}>
      <span ref={marker} className='absolute -z-10 rounded-full top-0 h-full bg-light transition-all ease-in-out duration-200' style={markerStyle} />
      {options.map((option, i) => {
        return <Link
          key={i}
          ref={e => { buttons.current[i] = e }}
          pathname={option.pathname}
          params={option.params}
          keepParams={keepParams}
          className={'block rounded-full py-1 transition-all px-3 hover:scale-105'}
          onClick={() => setSelected(option.label)}
        >
          {option.label}
        </Link>
      })}
    </div>
  )
}
