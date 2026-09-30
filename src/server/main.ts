// @ts-expect-error shut up
import rscEntry from "@/../dist/rsc/index.js";
import { updateTwitch } from "./twitch";
import { fetchPlayerList } from "./mc";

if (process.env.NODE_ENV == 'production') {
  const server = Bun.serve({
    port: 3000,
    fetch: rscEntry.fetch,
  })
  console.log('Listening on port', server.port)
}

async function update() {
  process.stdout.write('Updating...')
  const startTime = new Date()

  const onlinePlayers = await fetchPlayerList()
  await updateTwitch(onlinePlayers)

  process.stdout.write(` (took ${(new Date().getTime() - startTime.getTime()) / 1000}s)\n`)
}

setInterval(update, 60 * 1000)
await update()

