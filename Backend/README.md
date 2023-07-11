## Description

Task management RESTFul api built using [NestJS](https://github.com/nestjs/nest) , TypeScript, TypeORM and PostgreSQL.

## About Task Management

### Functional specs

Task management allows users to register, create tasks and manage them, major features are

- User SignUp & SignIn
- Create Tasks which are visible only to the logged in users
- New created tasks will be in OPEN status
- Update task status to IN_PROGRESS or DONE
- Delete tasks

### Technical methodologies followed

- Modular architecture: Tasks & Auth handled in separate modules, separating concerns.
- HTTP requests are handled by Controllers
- API documentation using nest/swagger module
- Business logic is implemented in Services
- Database interactions are handled in Repository classes using TypeORM
- Validation using NestJS Pipes
- Data Transfer Object(DTO) pattern for transferring data between layers
- Configuration management using .yml files for development, test & prod configs
- Authentication / Authorization, Task ownership by users
- PassportJS, JWT tokens, Password hashing, salts
- Unit tests using Jest
- Supertest for end to end testing

### Technical documentation using [Compodoc](https://compodoc.app)

As NestJS is heavily inspired by Angular, we can generate the documentation about project structure modules, controllers, services etc. I
have generated the docks and uploaded to netlify

https://task-mgmt-api-docs.netlify.app/modules.html

## Installation

```
pnpm install
```

## Running the app

### Prerequisite for local/dev mode

- Postgres should be running locally
- And a db called `task-mgmt` should be created ( can be updated in `config/development.yml` )

```bash
# development - watch mode
$ pnpm start:dev

# production mode
$ pnpm start
```

## Test

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

```
