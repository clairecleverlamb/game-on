GameOn - Sports Networking & Game-Matching Platform for AthletiX(e)
[Link to Trello Board](https://trello.com/b/5J4tnWWP/gameon)

Features & Restful Routes
----------

Users (Athletes & Players)
---------------------------
- Create: Sign up as an athlete, add sports interests & skill level.
- Read: View player profiles, check stats, and past games.
- Update: Edit profile, update skills, add highlight videos.
- Delete: Delete account if no longer using the app.

API Routes:
-----------
POST /api/users/register 
GET /api/users/:userId
PUT /api/users/:userId
DELETE /api/users/:userId


Pickup Games (Matchmaking & Game Management)
--------------------------------------------
- Create: Post a new game with location, time, skill level, and sport type.
- Read: View upcoming & nearby games. (Filter by sport, location, and skill level)
- Update: Modify game details, such as time, location, or player slots.
- Delete: Cancel a game if needed.

API Routes:
-----------
POST /api/games
GET /api/games?sport=Basketball&location=San Francisco
POST /api/games/:gameId/join
PUT /api/games/:gameId
DELETE /api/games/:gameId


Tournaments (Competitive Play)
------------------------------
- Create: Organize a tournament, set rules, bracket type, and team size.
- Read: View live tournaments, participant stats, and leaderboards.
- Update: Change match schedules or team registrations.
- Delete: Remove an incomplete or canceled tournament.

API Routes:
-----------
POST /api/tournaments
GET /api/tournaments/:tournamentId
POST /api/tournaments/:tournamentId/join
PUT /api/tournaments/:tournamentId
DELETE /api/tournaments/:tournamentId


Social Feed & Highlights (Player Engagement)
-------------------------------------------
- Create: Post game highlights, training clips, or sports discussions.
- Read: Browse sports content from other users.
- Update: Edit or delete posts.
- Delete: Remove unwanted posts.

API Routes:
-----------
POST /api/feed
GET /api/games/nearby?lat=37.7749&lng=-122.4194

Directory Structure:
--------------------
gameon/
│── controllers/
│   ├── auth.js               # User authentication (signup, login)
│   ├── games.js              # Manages sports games CRUD
│   ├── tournaments.js        # Manages tournaments CRUD
│   ├── users.js              # Handles user profiles CRUD
│
│── middleware/
│   ├── is-signed-in.js       # Middleware to check if user’s signed in 
│   ├── pass-user-to-view.js  # Passes user data to views
│
│── models/
│   ├── Game.js               # Mongoose schema for games
│   ├── Tournament.js         # Mongoose schema for tournaments
│   ├── User.js               # Mongoose schema for users
│
│── views/
│   ├── index.ejs             # Homepage
│   ├── games/                # Views for game listings & details
│   ├── tournaments/          # Views for tournament pages
│   ├── users/                # Views for athlete profiles
│
│── public/
│   ├── css/                  # Stylesheets
│   ├── js/                   # Client-side scripts
│   ├── assets/               # pics
│
│── server.js                 # Main server file
│── .env                      # Environment variables
│── package.json              # Dependencies and scripts
