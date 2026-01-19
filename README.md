# Boilerplate Project Monorepo

This is the boilerplate monorepo structure that can be used as a starting point for any new project. It includes a 
pre-configured setup for various tools and technologies commonly used in modern web development.

## Getting started

Install node.js (version 22 or higher is recommended), if you haven't already: [https://nodejs.org/](https://nodejs.org/)

```bash
brew install nvm
nvm install 22
nvm use 22
```

Install [pnpm](https://pnpm.io/) globally, if you haven't already:

```bash
corepack enable pnpm
```

Install the project dependencies:

```bash
pnpm i
```

Initialise the git hooks:

```bash
husky init
```

Apply environment variables:

```bash
cp ./apps/sample/.env.example ./apps/sample/.env
```

## Updates required before use

To customize this boilerplate monorepo for your specific project, please make the following changes:

- `docker-compose.yaml`
  - Remove any non-required infrastructure containers.
  - Replace instances of `project` where applicable to reflect your project name.
- `Dockerfile`
  - Replace `@project` with your project scope, e.g. `@myproject`.
- `eslint.config.mjs`
  - Replace `@project` with your project scope, e.g. `@myproject`.
- `package.json`
  - Rename the `name` field to reflect your project name.
  - Replace `@project` with your project scope, e.g. `@myproject`.
- `env.example`, `docker-compose.yaml`
  - Update db name `project_db` to reflect your project name.
- `/packages/**/*`
  - Rename `@project` with your project scope, e.g. `@myproject`.
- `/.infra/**/*`
  - Update any references to `project-` to reflect your project name.
  - Update any references to `<project>` to reflect your project name.

The `sample` app can be removed, it is only included to demonstrate the coding practises for backend nestjs services 
within the monorepo structure.

> Remember to update the `gateway:sample:gen` script in `package.json` if you remove or rename the sample app.

## Accessing the documentation

To access the documentation, please run the docs locally by following these steps:

```bash
docker compose up docs
```

Then you can access the documentation at: [http://localhost:5001](http://localhost:5001)