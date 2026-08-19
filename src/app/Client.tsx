'use client'
import { useEffect, useState } from "react";

export default function Client({ pathname }: { pathname: string }) {
  const [init, setInit] = useState(false)

  useEffect(() => {
    if (!init)
      setInit(true)
    else
      window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return <></>
}
