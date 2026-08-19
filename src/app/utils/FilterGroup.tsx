'use client'
import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";

type FilterGroupProps = {
  options: { label: string, href: string, disabled?: boolean }[],
  selected: string,
  className?: string,
}
export default function FilterGroup({ options, selected: externalSelected, className }: FilterGroupProps) {
  const marker = useRef(null)
  const buttons = useRef<(HTMLAnchorElement | null)[]>([])
  const [selected, setSelected] = useState(externalSelected)

  const selectedIndex = options.findIndex(option => option.label == selected)

  const markerStyle = {
    left: buttons.current[selectedIndex]?.offsetLeft,
    width: buttons.current[selectedIndex]?.clientWidth,
  }

  useEffect(() => {
    setSelected(externalSelected)
  }, [externalSelected])

  return (
    <div className={clsx('relative flex flex-row bg-white/10 z-10 rounded-full w-fit', className)}>
      <span ref={marker} className='absolute -z-10 rounded-full top-0 h-full bg-light transition-all ease-in-out duration-200' style={markerStyle} />
      {options.map((option, i) => {
        return <a
          key={i}
          ref={e => { buttons.current[i] = e }}
          href={option.href}
          className={clsx(
            'block rounded-full px-4 py-1 hover:scale-105 transition-all',
            option.disabled && 'cursor-default',
          )}
          aria-disabled={option.disabled}
          onClick={e => {
            if (option.disabled)
              e.preventDefault()
            else
              setSelected(option.label)
          }}
        >
          {option.label}
        </a>
      })}
    </div>
  )
}
