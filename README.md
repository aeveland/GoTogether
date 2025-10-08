l# GoTogether

GoTogether helps groups plan and coordinate events, trips, or shared activities with ease. It combines event creation, real-time updates, and group management in one place.

---

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Architecture & Stack](#architecture--stack)  
4. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Environment Variables](#environment-variables)  
   - [Running Locally](#running-locally)  
5. [Deployment](#deployment)  
6. [Usage](#usage)  
7. [Contributing](#contributing)  
8. [License](#license)  
9. [Contact](#contact)

---

## Overview

GoTogether is a simple collaborative planning app. Users can create an event, invite others, and stay synced as plans change.  
This repository includes both the backend and frontend portions of the app.

A live version may be available here:  
👉 [https://go-together-pink.vercel.app](https://go-together-pink.vercel.app)

---

## Features

- Create, edit, and delete events  
- Invite participants and manage RSVPs  
- Real-time updates when plans change  
- Basic authentication and user sessions  
- Optional integration with external services (configurable via environment variables)  
- Containerized for easy deployment (Docker / Railway)

---

## Architecture & Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | Prisma ORM (supports Postgres, MySQL, SQLite) |
| Deployment | Docker, Railway, or Vercel |
| Config | `.env` environment variables |
| Package Manager | npm or yarn |

Directory overview: