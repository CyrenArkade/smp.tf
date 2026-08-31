// @ts-expect-error shut up
import rscEntry from "@/../dist/rsc/index.js";
import { updateTwitch } from "./twitch";

setInterval(updateTwitch, 60 * 1000)

if (process.env.NODE_ENV == 'production') {
  const server = Bun.serve({
    port: 3000,
    fetch: rscEntry.fetch,
  })
  console.log('Listening on port', server.port)
}

await updateTwitch()

