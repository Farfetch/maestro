# Maestro Frontend

React.js Maestro frontend

## Requirements

- NVM v0.39.0 (https://github.com/nvm-sh/nvm)
- yarn v1.22.17 (https://yarnpkg.com)

## Installation

- Activate Node.js version

```bash
nvm install
nvm use
```

- Install dependencies

```bash
yarn install
```

- Configure environment

```bash
cp .env.example .env
```

## Usage

### Running application

`yarn start` - Run application in development mode by using _react-scripts_ features to watch changes.

`yarn build` - Build application static assets

### Linting & Formatting

`yarn check` - Run linting and formatting checks

`yarn lint` - Run Eslint linting checks

`yarn format` - Run prettier formatting checks

`yarn format-fix` - Run prettier to fix files formatting automatically

### Testing

`yarn test` - Run all tests

`yarn coverage` - Run tests and generate code coverage reports

## Documentation

### Design system

This project has built based on [Carbon design system](https://ant.design/). The main goal here is to use components whenever it's possible.

### Project Structure

Here are a few levels of the project that components should be located

- `/components` - responsible for storing all components that are relative to the React application
- `/components/layout` - pure components that might be reused through the application. They shouldn't include any dependencies from other services. As far as we are using design system, count of these components would be low.

### Components structure

On the Components based architecture, each component should be isolated. It is the recommended structure to follow in order to have the application component's consistency. Here is the basic example:

- `components/ComponentName/ComponentName.js` - where 'Component' is the name of the component that should be camelCased.
- `components/ComponentName/ComponentName.test.js` - tests for specific component
- `components/ComponentName/__snapshots__` - tests generated snapshots
