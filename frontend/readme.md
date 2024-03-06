# Sprout Frontend

[![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-next.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

> The Frontend packages are part of a [monorepo](https://gomonorepo.org/) managed with [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/), it contains multiple packages:

- "client" is the main app hosting the FarmOS home page, navbar and contains a React router to navigate to any Sprout application.
- "brand-ui" contains the common material UI React components used across all Sprout Applications.
- "core" contains common utilities, hooks and stores used by all Sprout Applications.
- "eslint-config" and "jest-config" contains common config for all projects in the mono-repo.
- "app-\*" are the various Sprout applications. See yeoman generator below to create the skelton for a new app.

### Main packages

Follow the commands below to install all dependencies for the monorepo

`yarn`

### To create a new Sprout application

Run the following

`yarn create-app`

This will prompt you for an application name (e.g., lab-testing) and description then create new the package in the monorepo. The yeoman generator will use the prefix "app-" for the app directory.
