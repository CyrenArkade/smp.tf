'use client'

import { forwardRef, useEffect, useState, type ComponentProps, type Ref } from "react";

type LinkProps = ComponentProps<'a'> & {
  pathname?: string,
  params?: Record<string, string>,
  keepParams?: string[],
}
function LinkRef({ pathname, params, keepParams = [], href, ...props }: LinkProps, ref: Ref<HTMLAnchorElement>) {
  const [finalPathname, setFinalPathname] = useState(pathname)
  const [finalParams, setFinalParams] = useState(params)

  function updateUrl() {
    const url = new URL(window.location.href)
    setFinalPathname(pathname ?? url.pathname)
    setFinalParams({
      ...Object.fromEntries(url.searchParams.entries().filter(([k, _v]) => keepParams.includes(k))),
      ...(params ?? {}),
    })
  }

  useEffect(() => {
    navigation.addEventListener('navigatesuccess', updateUrl)
    return () => navigation.removeEventListener('navigatesuccess', updateUrl)
  }, [])

  useEffect(updateUrl, [pathname, params])

  return (
    <a
      ref={ref}
      href={finalPathname + (Object.keys(finalParams ?? {}).length ? `?${new URLSearchParams(finalParams)}` : '')}
      {...props}
    />
  )
}
const Link = forwardRef(LinkRef)
export default Link

