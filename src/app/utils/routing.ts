export function parsePathType(pathname: string): string {
  return (
    pathname === '/'
      ? 'all'
    : pathname === '/multi'
      ? 'favorites'
      : 'one'
  )
}

