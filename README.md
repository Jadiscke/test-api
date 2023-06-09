# SHAWN TEST API

## Introduction

The backend should be implemented as a RESTful API using Node. (Try not to use an opinionated framework such as Adonis or Nest).
The backend must include the following endpoints:
[POST /api/files] An endpoint that accepts a CSV file upload from the frontend and stores the data in a database or a data structure.
[GET /api/users] Should include an endpoint that allows the frontend to search through the loaded CSV data.
The search endpoint should accept a ?q= query parameter for search terms and should search through EVERY column of the CSV
The backend should include appropriate error handling for invalid requests or other errors.

## Requirements

- Node.js
- PostgreSQL
- Docker

## Enviroment Variables

### Local

Create a .env file in the root of the project and add the following variables:

- `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shawn?schema=public"`

## Running the API

### Local
First you will need to install the dependecies with `npm install` or `yarn`.

Then you can run the PostgreSQL with `docker compose up -d postgres`

With the the postgres running just migrate the database with prisma:

`npx prisma migrate dev`

With the database set up, run the development server with `yarn dev` or `npm run dev`

## Testing

For running the tests just run `yarn test` or `npm run test`
