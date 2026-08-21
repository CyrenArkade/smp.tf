'use client'
import { useEffect } from "react";

export default function Client() {
  useEffect(() => {
    const old = window.history.pushState
    window.history.pushState = function (...args) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return old.apply(this, args)
    }
    return () => { window.history.pushState = old }
  }, [])

  return <></>
}
