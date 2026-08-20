// @ts-expect-error shut up
import rscEntry from "@/../dist/rsc/index.js";
import { update_twitch } from "./twitch";

setInterval(update_twitch, 60 * 1000)

const server = Bun.serve({
  port: 3000,
  fetch: rscEntry.fetch,
})
console.log('Listening on port', server.port)

