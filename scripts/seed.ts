import { $ } from "bun";
import * as sch from "@/db/schema";

await $`rm -f db.sqlite`
await $`bunx drizzle-kit push`

// import after reset
const { default: db } = await import("@/db/db");
const { twitch } = await import("@/server/twitch");

const creators = [
  {name: "millkberry", twitchName: "millkberry"},
  {name: "megiibyte", twitchName: "megiibyte"},
  {name: "Roscumber", twitchName: "roscumber"},
  {name: "highkeyolie", twitchName: "highkeyoli"},
  {name: "michela", twitchName: "michela"},
  {name: "ClownPierce", twitchName: "clownpierce"},
  {name: "ashswag", twitchName: "ashswag"},
  {name: "Lukey", twitchName: "lukey"},
  {name: "Squiddo", twitchName: "therealsquiddo"},
  {name: "aimsey", twitchName: "aimsey"},
  {name: "TheAmbear", twitchName: "theambear"},
  {name: "jojosolos", twitchName: "jojosolos"},
  {name: "Snifferish", twitchName: "snifferish"},
  {name: "vgumiho", twitchName: "vgumiho"},
  {name: "Pyroscythe", twitchName: "pyroscythe"},
  {name: "InfiniteDrift", twitchName: "infinitedrift"},
  {name: "Seapeekay", twitchName: "seapeekay"},
  {name: "soupforeloise", twitchName: "soupforeloise"},
  {name: "BoaRoo", twitchName: "boaroo"},
  {name: "Smajor", twitchName: "smajor"},
  {name: "Shubble", twitchName: "shubble"},
  {name: "Cambam", twitchName: "cambam"},
  {name: "melinks", twitchName: "melinks_"},
  {name: "watermunch", twitchName: "watermunch"},
  {name: "FalseSymmetry", twitchName: "falsesymmetry"},
  {name: "heygraecie", twitchName: "Graecie"},
  {name: "Elaina", twitchName: "elainaexe"},
  {name: "InTheLittleWood", twitchName: "inthelittlewood"},
  {name: "MythicalSausage", twitchName: "mythicalsausage"},
  {name: "Legundo", twitchName: "legundo"},
  {name: "CaptainSparklez", twitchName: "captainsparklez"},
  {name: "KaraCorvus", twitchName: "karacorvus"},
  {name: "PrinceZam", twitchName: "princezam"},
  {name: "Ghostiefruit", twitchName: "ghostiefruit"}
]

for (const creator of creators) {
  const user = await twitch.users.getUserByName(creator.twitchName)
  if (!user)
    throw new Error(`${creator.twitchName} is not a valid Twitch username`)
  
  await db.insert(sch.creator)
    .values({
      name: creator.name,
      twitchId: user.id,
      live: false,
    })
}

