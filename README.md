<h1 align="center">Transcendence</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/42vogons/transcendence?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/42vogons/transcendence?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/42vogons/transcendence?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/42vogons/transcendence?color=56BEB8">

  <img alt="Github issues" src="https://img.shields.io/github/issues/42vogons/transcendence?color=56BEB8" />
</p>

<hr>

<p align="center">
  <a href="#about">About</a> &#xa0; | &#xa0;
  <a href="#play">Play</a> &#xa0; | &#xa0;
  <a href="#features">Features</a> &#xa0; | &#xa0;
  <a href="#technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#starting">Starting</a> &#xa0; | &#xa0;
  <a href="#license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/orgs/42vogons/teams/transcendence-the-last-of-us" target="_blank">Authors</a>
</p>

<br>

## About ##

Transcendence is a modern take on the classic Pong game. Our platform offers real-time multiplayer pong games, a chat system, and user accounts with enhanced security features, including OAuth login and two-factor authentication.

## Play

The game is live and available for play at: [http://the-last-of-us-transcendence.online/](http://the-last-of-us-transcendence.online/).
Feel free to challenge your friends or other players from around the world!

## Features ##

- **Real-Time Multiplayer Pong Game:** Challenge players to a game of Pong directly on the website.
- **Matchmaking System:** Join a queue to be automatically matched with another player.
- **Customization Options:** Choose from various court colors to customize your game experience or play on the classic Pong court.
- **User Accounts:** Secure login via 42 OAuth, customizable profiles, avatars, and two-factor authentication.
- **Friend System:** Add other users as friends and see their online status.
- **Chat System:** Public, private, or password-protected chat rooms, direct messaging, and user blocking.
- **User Profiles:** View user stats, match history, and ladder levels.

## Technologies ##

The following tools were used in this project:

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [NextJS](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Socket.io](https://socket.io/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

## Requirements ##

Before starting, you need to have [Git](https://git-scm.com) and [Docker](https://www.docker.com/) installed.

## Starting ##

```bash
# Clone this project
git clone https://github.com/42vogons/transcendence

# Access
cd transcendence

# Rename .env_examples to .envs and edit variables values
mv .env_example .env
mv front/.env.local_example front/.env.local 

# Run the project
docker-compose up --build

# The server will initialize in the:
# frontend <http://localhost:3000>
# backend <http://localhost:3001>
# database <http://localhost:5432>
```

## License ##

This project is under license from MIT. For more details, see the [LICENSE](LICENSE) file.

&#xa0;

<a href="#top">Back to top</a>
