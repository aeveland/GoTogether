# GoTogether

One-sentence description: A social / event / planner app (or whatever GoTogether is).

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Architecture & Stack](#architecture--stack)  
4. [Getting Started](#getting-started)  
   * [Prerequisites](#prerequisites)  
   * [Installation](#installation)  
   * [Running Locally](#running-locally)  
   * [Environment Variables / Configuration](#environment-variables--configuration)  
5. [Deployment](#deployment)  
6. [Usage](#usage)  
7. [Contributing](#contributing)  
8. [License](#license)  
9. [Contact / Support](#contact--support)

## Overview

GoTogether is a (web/mobile) application that allows users to (briefly describe the core value): e.g. create events, invite friends, coordinate logistics, share status, etc.

This repository holds both the frontend and backend (or server) components.  

Live demo (if exists): `https://go-together-pink.vercel.app`  [oai_citation:0‡GitHub](https://github.com/aeveland/GoTogether)

## Features

- User registration / login  
- Create, edit, delete events  
- Invite participants / RSVP  
- Notifications / reminders  
- Real-time updates / presence  
- (Any other distinguishing features)

## Architecture & Stack

- **Frontend**: built with React + Vite  [oai_citation:1‡GitHub](https://github.com/aeveland/GoTogether)  
- **Backend / Server**: Node.js (check `server.js` and `simple-server.js`)  [oai_citation:2‡GitHub](https://github.com/aeveland/GoTogether)  
- **Database / ORM / Persistence**: (You have a `prisma` directory, so Prisma is used)  [oai_citation:3‡GitHub](https://github.com/aeveland/GoTogether)  
- **Deployment / Hosting**: (Docker, Vercel, Railway, etc — there’s a `Dockerfile` and `railway.toml`)  [oai_citation:4‡GitHub](https://github.com/aeveland/GoTogether)  
- **Static / Public Assets**: in `public/`  [oai_citation:5‡GitHub](https://github.com/aeveland/GoTogether)  

## Getting Started

### Prerequisites

Make sure you have:

- Node.js (version X or higher)  
- npm or yarn  
- (If using Docker) Docker & Docker Compose  
- A database supported by Prisma (e.g. PostgreSQL, MySQL, SQLite)  

### Installation

```bash
# clone the repo
git clone https://github.com/aeveland/GoTogether.git
cd GoTogether

# install dependencies
npm install
# or
yarn install