<p align="center">
  <img alt="Project logo" src="src/app/assets/flight-logo.png" width="300">
</p>

# smp.tf
Content tracker for The Flight SMP.  
Because there are too damn many good PoVs :3

### what it do?
* Pulls streams and VoDs from Twitch and displays a feed
* Filter by creator
* Filter out non-Flight streams and VoDs
  * Checks if they ever have had "flight" in their titles.
  * Unfortunately there is no better way :(
* Favorite creators and see a feed of only them

### development

#### .env
```.env
DB_PATH=path_to_sqlite_db (ex. db.sqlite)

# smp.tf uses Twitch's app tokens for authentication
TWITCH_CLIENT_ID=your_twitch_id
TWITCH_CLIENT_SECRET=your_twitch_secret
```

#### setup
```bash
# to seed the database with all creators
bun run seed

# in the background, run the server
# it simply periodically fetches info from twitch
# can run once then kill if you cba backgrounding
bun run server

# start the webserver
bun run dev
```
