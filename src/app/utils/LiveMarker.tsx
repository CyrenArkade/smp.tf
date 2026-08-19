export default function LiveMarker({ live, className }: { live: boolean, className?: string }) {
  return live &&
    <span
      className={'px-1 py-0.5 bg-red-500 rounded-sm text-xs font-bold uppercase ' + (className ?? '')}
    >
      Live
    </span>
}
