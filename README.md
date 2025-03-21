# Game On Sports Connect

Game On Sports Connect [ [Start App From Here](https://game-on-7e67046190a3.herokuapp.com/)] is a dynamic web application designed to bring sports enthusiasts together. Whether you're looking to join a casual game, compete in a tournament, or connect with a vibrant community of players, this platform has it all. With a sleek, sporty design and interactive features, Game On Sports Connect makes it easy to explore, participate, and showcase your athletic achievements.

## Screenshots
**Home Page**
![HomePage](public/assets/read/readme1.png)

**Profile Page**
![ProfilePage](public/assets/read/readme3.png)

**Community Page**
![Community](public/assets/read/readme4.png)

**Game Page**
![GamePage](public/assets/read/readme2.png)


## Features
- **User Profiles**: Create and edit personalized profiles with full name, location, sports interests, profile pictures, and highlight videos.
- **Games & Tournaments**: Discover, join, and create upcoming games and tournaments with details like location, time, skill level, and participant limits.
- **Community Hub**: Browse a list of community members, view their profiles, and connect with fellow sports lovers.
- **Highlight Videos**: Share and like video highlights with an interactive heart (❤️) system.
- **Responsive Design**: Enjoy a seamless experience across devices with a modern, visually appealing interface.
- **Interactive Elements**: Hover effects, animations (e.g., pulsing "Game On" title), and centered layouts for upcoming events.

## Tech Stack
### Backend:
- **Node.js:** JavaScript runtime for server-side logic.
- **Express.js:** Web framework for routing and middleware.
- **MongoDB:** NoSQL database for storing users, games, and tournaments (via Mongoose ODM).
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
- **Passport.js:** Authentication middleware for managing user sessions.
- **Express-Session:** For user session management.
- **Method-Override:** To allow PUT and DELETE HTTP methods in forms.
- **Dotenv:** For environment variable management.
- **Morgan:** HTTP request logger for debugging.
- **Node-Cron:** Scheduler for running periodic tasks, like updating completed games and tournaments.

### Frontend:
- **HTML/CSS:** Structured content and custom styling.
- **JavaScript:** Client-side interactivity (e.g., AJAX for liking videos).
- **EJS:** Embedded JavaScript templating for dynamic HTML rendering.
- **Custom CSS:** Responsive design with variables (--primary-color, --accent-color), gradients, and animations.

### Dependencies:
- **express**: For routing and server setup.
- **mongoose**: For MongoDB schema and queries.
- **passport**: For user authentication.
- **express-session**: For managing user sessions.
- **method-override**: For supporting additional HTTP methods in forms.
- **dotenv**: For environment variable management.
- **morgan**: For logging requests.
- **node-cron**: For scheduling tasks.


## Usage
- **Sign Up/In**: Create an account or log in at `/auth/sign-up` or `/auth/sign-in`.
- **Profile**: View and edit your profile at `/users` or `/users/edit`.
- **Games**: Browse at `/games`, create at `/games/new`, view/edit at `/games/:id`.
- **Tournaments**: Browse at `/tournaments`, create at `/tournaments/new`, view/edit at `/tournaments/:id`.
- **Community**: Explore users at `/users/community`.
- **Highlights**: Add and like video highlights on your profile page.


## Further Improvements
- **Notifications:** Participants receive notifications when the creator of a game updates details.
- **Community Search:** Users can search for others in the community by name, location, or sports interests.
- **Messaging System:** Direct messaging allows users to communicate with each other.
- **More Community Features:** Friend requests, activity feeds, and personalized recommendations enhance engagement.

