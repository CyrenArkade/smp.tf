'use client'
import { useEffect } from "react";

export default function ListTitle({ creators }: { creators: 'all' | string[] }) {
  useEffect(() => {
    if (creators == 'all' || creators.length == 0)
      document.title = 'smp.tf'
    else
      document.title = `${creators.join(', ')} | smp.tf`
  })

  return <></>
}
