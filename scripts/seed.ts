import { $ } from "bun";
import * as sch from "@/db/schema";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    reset: { type: 'boolean' },
  },
  strict: true,
  allowPositionals: true,
})

if (values.reset) {
  await $`rm -f db.sqlite`
  await $`bunx drizzle-kit push`
}

// import after reset
const { default: db } = await import("@/db/db");
const { twitch } = await import("@/server/twitch");

const creators = [
  { name: "millkberry", twitchName: "millkberry", minecraftName: "millkberry" },
  { name: "megiibyte", twitchName: "megiibyte", minecraftName: "megiibyte" },
  { name: "Roscumber", twitchName: "roscumber", minecraftName: "Roscumber" },
  { name: "highkeyolie", twitchName: "highkeyoli", minecraftName: "highkeyoli" },
  { name: "michela", twitchName: "michela", minecraftName: "DarkEyebrows" },
  { name: "ClownPierce", twitchName: "clownpierce", minecraftName: "ClownPierce" },
  { name: "ashswag", twitchName: "ashswag", minecraftName: "ashswagg" },
  { name: "Lukey", twitchName: "lukey", minecraftName: "LukeyTV" },
  { name: "Squiddo", twitchName: "therealsquiddo", minecraftName: "TheRealSquiddo" },
  { name: "aimsey", twitchName: "aimsey", minecraftName: "aimsey" },
  { name: "TheAmbear", twitchName: "theambear", minecraftName: "TheAmbear" },
  { name: "jojosolos", twitchName: "jojosolos", minecraftName: "jojosolos" },
  { name: "Snifferish", twitchName: "snifferish", minecraftName: "Snifferish" },
  { name: "vgumiho", twitchName: "vgumiho", minecraftName: "vGumiho" },
  { name: "Pyroscythe", twitchName: "pyroscythe", minecraftName: "Pyroscythe" },
  { name: "InfiniteDrift", twitchName: "infinitedrift", minecraftName: "infinitedrift" },
  { name: "Seapeekay", twitchName: "seapeekay", minecraftName: "Seapeekay" },
  { name: "soupforeloise", twitchName: "soupforeloise", minecraftName: "soupforeloise" },
  { name: "BoaRoo", twitchName: "boaroo", minecraftName: "BoaRoo" },
  { name: "Smajor", twitchName: "smajor", minecraftName: "Smajor1995" },
  { name: "Shubble", twitchName: "shubble", minecraftName: "ShubbleYT" },
  { name: "Cambam", twitchName: "cambam", minecraftName: "Cambam010" },
  { name: "melinks", twitchName: "melinks_", minecraftName: "melinks" },
  { name: "watermunch", twitchName: "watermunch", minecraftName: "watermunch" },
  { name: "FalseSymmetry", twitchName: "falsesymmetry", minecraftName: "falsesymmetry" },
  { name: "heygraecie", twitchName: "Graecie", minecraftName: "heyGraecie" },
  { name: "Elaina", twitchName: "elainaexe", minecraftName: "ElainaExe" },
  { name: "InTheLittleWood", twitchName: "inthelittlewood", minecraftName: "InTheLittleWood" },
  { name: "MythicalSausage", twitchName: "mythicalsausage", minecraftName: "MythicalSausage" },
  { name: "Legundo", twitchName: "legundo", minecraftName: "Legundo" },
  { name: "CaptainSparklez", twitchName: "captainsparklez", minecraftName: "CaptainSparklez" },
  { name: "KaraCorvus", twitchName: "karacorvus", minecraftName: "KaraCorvus" },
  { name: "PrinceZam", twitchName: "princezam", minecraftName: "PrinceZam" },
  { name: "Ghostiefruit", twitchName: "ghostiefruit", minecraftName: "ghostiefruit" },
  { name: "acho", twitchName: "acho", minecraftName: "acho" },
  { name: "raerevord", twitchName: "raerevord", minecraftName: "raerevord" },
  { name: "ZombieCleo", twitchName: "zombiecleo", minecraftName: "ZombieCleo" },
]

for (const creator of creators) {
  const user = await twitch.users.getUserByName(creator.twitchName)
  if (!user)
    throw new Error(`${creator.twitchName} is not a valid Twitch username`)
  
  await db.insert(sch.creator)
    .values({
      name: creator.name,
      twitchId: user.id,
      minecraftName: creator.minecraftName,
      live: false,
    })
    .onConflictDoNothing()
}

