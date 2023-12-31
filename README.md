<h1 align="center">Transcendence</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/42vogons/transcendence?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/42vogons/transcendence?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/42vogons/transcendence?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/42vogons/transcendence?color=56BEB8">

  <img alt="Github issues" src="https://img.shields.io/github/issues/42vogons/transcendence?color=56BEB8" />

  <img alt="Github forks" src="https://img.shields.io/github/forks/42vogons/transcendence?color=56BEB8" />

  <img alt="Github stars" src="https://img.shields.io/github/stars/42vogons/transcendence?color=56BEB8" />
</p>


<h4 align="center"> 
	🚧  Transcendence 🚀 Under construction...  🚧
</h4> 

<hr>

<p align="center">
  <a href="#about">About</a> &#xa0; | &#xa0; 
  <a href="#features">Features</a> &#xa0; | &#xa0;
  <a href="#technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#starting">Starting</a> &#xa0; | &#xa0;
  <a href="#database">DataBase</a> &#xa0; | &#xa0;
  <a href="#license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/orgs/42vogons/teams/transcendence-the-last-of-us" target="_blank">Authors</a>
</p>

<br>

## About ##

Describe your project

## Features ##

Feature 1;\
Feature 2;\
Feature 3;

## Technologies ##

The following tools were used in this project:

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)

## Requirements ##

Before starting :checkered_flag:, you need to have [Git](https://git-scm.com) and [Docker](https://www.docker.com/) installed.

## Starting ##

```bash
# Clone this project
git clone https://github.com/42vogons/transcendence

# Access
cd transcendence

# Rename .env_example to .env and edit your variables values
mv .env_example .env

# Run the project
docker-compose up --build

# The server will initialize in the:
# frontend <http://localhost:3000>
# backend <http://localhost:3001>
# database <http://localhost:5432>
```

## DataBase ##

```bash
# Access
cd transcendence/back/migrations

# Create a .env file in the migrations directory
mv .env_example .env

# Make the sql script executable
chmod +x 202312032330_create_tables.sh

# Execute the script
bash 202312032330_create_tables.sh

# The script will read configurations from the .env file, connect to your
# PostgreSQL database in the specified Docker container, and execute
# the SQL script to create the tables.

# How to do a migration using Prisma:
# Run docker for db only
docker-compose up --build db
# Go to back directory
cd back
# Update you back/.env with DB_HOST=localhost
# Update prisma.scheme with your migration
# Run migrate Prisma command
npx prisma migrate dev --create-only
```

## License ##

This project is under license from MIT. For more details, see the [LICENSE](LICENSE) file.

&#xa0;

<a href="#top">Back to top</a>
