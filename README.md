# Note API

--- 
A simple REST API for managing personal notes with JWT authentication, built using NestJS and TypeScript.

## Tech Stack

- NestJS (TypeScript)
- Prisma
- Mysql

## Features

- Register & Login with JWT authentication
- CRUD Notes (create, read, update, delete)
- Each note is tied to its owner user. (ownership validation)
- Protected routes with JWT Guard

## Project Structure

```plantuml
src/     
├── common/      
├── note/      
├── user/      
└── app.module.ts
```

## Architecture & Design Pattern

Project ini menerapkan Modular Architecture bawaan NestJS. Setiap domain (user, note) diisolasi penuh ke dalam modulnya masing-masing yang menerapkan pattern Controller-Service-Repository (via Prisma).

- Controller: Hanya bertanggung jawab menerima HTTP request, validasi DTO, dan mengirim HTTP response.

- Service: Tempat mengisolasi seluruh business logic utama dan pengecekan validasi kepemilikan (ownership verification).
## Setup & Installation

```bash
git clone https://github.com/dfnc1/Note-App-API.git
cd Note-App-API
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm run start:dev
```

## Environment Variables

```dotenv
DATABASE_URL=

DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
DATABASE_CONNECTION_LIMIT=

SALT=
JWT_SECRET= # openssl rand -hex 32
PORT=
```

## API Endpoints

| Method | Endpoint        | Auth Required | Deskripsi               |
|--------|-----------------|----------------|-------------------------|
| POST   | /auth/register  | No             | Create new user         |
| POST   | /auth/login     | No             | Login, return JWT token |
| GET    | /notes          | Yes            | List notes milik user   |
| POST   | /notes          | Yes            | Buat note baru          |
| GET    | /notes/:id      | Yes            | Detail satu note        |
| PATCH  | /notes/:id      | Yes            | Update note             |
| DELETE | /notes/:id      | Yes            | Hapus note              |

## Running Tests

```bash
pnpm run test:e2e
```