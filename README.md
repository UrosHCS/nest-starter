# NestJS starter app

This is a boilerplate NestJS app based on the opinions from the Nest documentation, plus some additional ones. The purpose of this repository is similar to the very useful [nestjs-realworld-example-app](https://github.com/lujakob/nestjs-realworld-example-app).

This repository was inspired by the amazing [Laravel](https://laravel.com/) framework. Some features that are included in Laravel, are also implemented in this repository. Current features are:

- Database migrations (TypeORM sync feature),
- Entity (model) factories, used mainly for testing purposes,
- Some basic seeding,
- REPL that has the application context ready for use (ard),
- Authentication endpoints ready (/login, /register, /me),
- Basic pagination functionality,
- Separate database setup for dev/prod and tests,
- Separate configuration per module,
- Validation setup done for validating requests,
- Implemented trim strings functionality (not mandatory for a backend API),
- E2E tests setup done that include hitting the sqlite database,
- Docker setup done,

Some smaller features also, check out the `shared` module.

TODO:

- Write a seeding package,
- Set up websocket,
- Set up mail,
- Set up image upload,
- Set up auth with google and facebook,

## Set up

Clone this project, then run

`docker-compose run app npm install`

Copy `.env.example` to `.env`, generate a unique string that will be used for JWT encoding and decoding and set it as the `JWT_SECRET` variable.

Start the app in watch and debug mode with

`docker-compose up`

Create database tables while docker-compose is up

`docker exec -it app npm run typeorm schema:sync`

Seed some data

`docker exec -it app node scripts/seed.js`

## Test

To execute tests, run

`docker exec -it app npm run test`

## Debug

With `docker-compose up` the app starts with debug mode. So you can just run the `Attach to docker` task and debug the app. This task is defined in `.vscode/launch.json` as well as some other debugging tasks.

## Ard

The `ard` script gives you an environment to tinker with your app and it gives you top-level await. It registers the app instance, repositories, entity classes and the factory function globally so you can easily access and use it. There is a js version and a ts version.

The js version needs the app to be compiled first with `tsc` or `nest build`, but then you can run it without waiting for typescript compilation. Run it with `npm run ard` or:

`docker exec -it app npm run ard`

It uses the code from `dist` folder.

The ts version allows you to run ard without compiling typescript beforehand. It uses the code from `src`. There are two ways to run it. The `npm run ts-ard` script allows you to write typescript code in the REPL. The `npm run ard-from-src` script does not give you typescript in REPL but allows top-level await like regular `npm run ard`.

The `ts-ard` is not working correctly because TypeScript does not see the registered global variables. Maybe there is a way around this.

## Env variables

There is one important environment variable that impacts the app setup - `NODE_ENV`. Default value is `"develop"`. Running tests will set NODE_ENV to `"test"`. The only difference at the moment is that test env will use `.env.test` instead of `.env`.