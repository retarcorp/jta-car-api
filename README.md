# Car API
Car API allows to manage cars list in internal memory and create bookings for cars according to timing policy
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Test coverage
Test coverage is 94.5%. Entrypoint is not covered.

## Swagger API
Run application in dev mode and request /api endpoint to see and play with API

## Postman API
Postman API collection attached to a repo with .postman_collection.json extension. Import the collection to play and test the API in Postman.

## Docker
Backend can be run in dev mode in a docker container described in docker-compose.yml here
```bash
docker compose up -d
```

## Pre-commit
This repo automatically lauches tests before any commits. No commit is possible if tests didn't pass.

## State management
Internal memory storage is used in this project and covered by InternalStoreService class. However, store manager can be replaced with another provider that implements abstract StoreService.

## To Do
- Add lint autofix
- Create specific exception types
