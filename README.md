# CRM Project Monorepo

This is the boilerplate monorepo structure that can be used as a starting point for any new project. It includes a
pre-configured setup for various tools and technologies commonly used in modern web development.

## Updates required before use

After creating a new project repo from this boilerplate repo, you will need customize certain for your specific project,
please make the following changes:

- `/.github/workflows/**/*`
  - Update any references to `project-` to reflect your project name.

- `/.infra/**/*`
  - Update any references to `project-` to reflect your project name.
  - Update any references to `<project>` to reflect your project name.
  - Update the `example.com` domain to your project's domain.

- `/apps/**/*`
  - Update any references to `@project` with your project scope, e.g. `@super-project`.

- `/packages/**/*`
  - Rename `@project` with your project scope, e.g. `@super-project`.

- `docker-compose.yaml`
  - Remove any non-required infrastructure containers.
  - Replace instances of `project` where applicable to reflect your project name.
  - Update db name `project_db` to reflect your project name.

- `Dockerfile`
  - Replace `@project` with your project scope, e.g. `@super-project`.

- `eslint.config.mjs`
  - Replace `@project` with your project scope, e.g. `@super-project`.

- `package.json`
  - Rename the `name` field to reflect your project name.
  - Replace `@project` with your project scope, e.g. `@super-project`.

- `env.example`
  - Update db name `project_db` to reflect your project name.


The `sample` app can be removed, it is only included to demonstrate the coding practises for backend nestjs services
within the monorepo structure.

> Remember to update the `gateway:sample:gen` script in `package.json` if you remove or rename the sample app.

## Getting started

Once you have customized the boilerplate for your project, follow these steps to get started:

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

Build packages:

```bash
pnpm build
```

Apply environment variables:

```bash
cp ./apps/analytics/.env.example ./apps/analytics/.env
cp ./apps/sample/.env.example ./apps/sample/.env
```

> Ensure to enable eslint and prettier on save in your IDE to maintain code quality and consistency across the codebase.

## Accessing the documentation

To access the documentation, please run the docs locally by following these steps:

```bash
docker compose up docs
```

Then you can access the documentation at: [http://localhost:5001](http://localhost:5001)

## Setting up GitHub

Ensure the required GitHub secrets are added to your repository for CI/CD workflows to function correctly.
The necessary secrets include:

- `AWS_REGION`
- `AWS_ACCOUNT_ID`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `RELEASE_PLEASE_GITHUB_TOKEN`