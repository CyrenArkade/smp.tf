'use client'

import { forwardRef, useEffect, useState, type ComponentProps, type ReactNode, type Ref } from "react";

function filterUndefined(params: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(params).filter(([_k, v]) => v)
  ) as Record<string, string>
}

type LinkProps = {
  pathname?: string,
  params?: Record<string, string | undefined>,
} & ComponentProps<'a'>
function LinkRef({ pathname, params, ...props }: LinkProps, ref: Ref<HTMLAnchorElement>) {
  const [finalPathname, setFinalPathname] = useState(pathname)
  const [finalParams, setFinalParams] = useState(filterUndefined(params ?? {}))

  useEffect(() => {
    const url = new URL(window.location.href)
    setFinalPathname(pathname ?? url.pathname)
    setFinalParams(filterUndefined({
      ...Object.fromEntries(url.searchParams.entries()),
      ...(params ?? {}),
    }))
  }, [pathname, params])

  return (
    <a
      ref={ref}
      href={finalPathname + (Object.keys(finalParams).length ? `?${new URLSearchParams(finalParams)}` : '')}
      {...props}
    />
  )
}
const Link = forwardRef(LinkRef)
export default Link

