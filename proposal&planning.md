# GameOn API - Sports Networking & Game-Matching Platform for AthletiX(e)

[Link to Trello Board](https://trello.com/b/5J4tnWWP/gameon)

## Features & Restful Routes

### Users (Athletes & Players)
- **Create**: Sign up as an athlete, add sports interests & skill level.
- **Read**: View player profiles, check stats, and past games.
- **Update**: Edit profile, update skills, add highlight videos.
- **Delete**: Delete account if no longer using the app.

#### API Routes:
```
POST /gameon/users/register
GET /gameon/users/:userId
PUT /gameon/users/:userId
DELETE /gameon/users/:userId
```

### Pickup Games (Matchmaking & Game Management)
- **Create**: Post a new game with location, time, skill level, and sport type.
- **Read**: View upcoming & nearby games. (Filter by sport, location, and skill level)
- **Update**: Modify game details, such as time, location, or player slots.
- **Delete**: Cancel a game if needed.

#### API Routes:
```
POST /gameon/games
GET /gameon/games?sport=Basketball&location=San Francisco
POST /gameon/games/:gameId/join
PUT /gameon/games/:gameId
DELETE /gameon/games/:gameId
```

### Tournaments (Competitive Play)
- **Create**: Organize a tournament, set rules, bracket type, and team size.
- **Read**: View live tournaments, participant stats, and leaderboards.
- **Update**: Change match schedules or team registrations.
- **Delete**: Remove an incomplete or canceled tournament.

#### API Routes:
```
POST /gameon/tournaments
GET /gameon/tournaments/:tournamentId
POST /gameon/tournaments/:tournamentId/join
PUT /gameon/tournaments/:tournamentId
DELETE /gameon/tournaments/:tournamentId
```

### Social Feed & Highlights (Player Engagement)
- **Create**: Post game highlights, training clips, or sports discussions.
- **Read**: Browse sports content from other users.
- **Update**: Edit or delete posts.
- **Delete**: Remove unwanted posts.

#### API Routes:
```
POST /gameon/feed
GET /gameon/games/nearby?lat=37.7749&lng=-122.4194
```

## Directory Structure:

# Game-On Sports Connect

## Project Structure

```
game-on-sports-connect/
│
│── config/
│   ├── passport-config.js    # Configuration for authentication
│
│── controllers/
│   ├── auth.js              # Handles authentication (signup, login)
│   ├── users.js             # Handles user operations (CRUD profile)
│   ├── games.js             # Handles game operations (CRUD for users)
│   ├── tournaments.js       # Handles tournament-related functions (creation, management, and deletion of tournaments)
│
│── middleware/
│   ├── is-signed-in.js      # Middleware to check if a user is signed in
│   ├── pass-user-to-view.js # Passes user data to views
│
│── models/
│   ├── game.js              # Mongoose schema for games
│   ├── user.js              # Mongoose schema for users
│   ├── tournament.js        # Mongoose schema for tournaments
│
│── views/
│   ├── index.ejs            # Homepage
│   ├── auth/
│   │   ├── sign-in.ejs      # Login page
│   │   ├── sign-up.ejs      # Registration page
│   ├── partials/
│   │   ├── header.ejs       # Header partial
│   │   ├── footer.ejs       # Footer partial
│   │   ├── sidebar.ejs      # Sidebar partial
│   │   ├── subheader.ejs    # Subheader partial
│   │   ├── game-item.ejs    # Game item partial
│   │   ├── tournament-item.ejs # Tournament item partial
│   ├── users/
│   │   ├── profile.ejs      # User profile page (view personal info, skill level, and events)
│   │   ├── profile-edit.ejs # Page for editing and deleting profile
│   ├── games/
│   │   ├── edit.ejs         # Edit game page
│   │   ├── index.ejs        # List all games
│   │   ├── new.ejs          # Create new game
│   │   ├── show.ejs         # Show individual game details
│   ├── tournaments/
│   │   ├── edit.ejs         # Edit tournament page
│   │   ├── index.ejs        # List all tournaments
│   │   ├── new.ejs          # Create new tournament
│   │   ├── show.ejs         # Show individual tournament details
│
│── public/
│   ├── css/                 # Stylesheets
│   ├── js/                  # Client-side scripts
│
│── server.js                # Main server file
│── .env                     # Environment variables
│── package.json             # Dependencies and scripts
```


