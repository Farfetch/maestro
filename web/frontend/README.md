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

`yarn lint` - Run eslint linting checks

`yarn format` - Run prettier formatting checks

`yarn format-fix` - Run prettier to fix files formatting automatically

### Testing

`yarn test` - Run all tests

`yarn coverage` - Run tests and generate code coverage reports

## Documentation

### Design system

This project has built based on [Carbon design system](https://ant.design/). The main goal here is to use components whenewher it's possible.

### Project Structure

Here is a few levels of the project that componets should be located

- `/components` - responsible for stioring all components that is relative to the React application
- `/components/layout` - pure components that might be reused through the application. They shouldn't include any dependencies from other services. As far as we are using design system, count of these components would be low.

### Components structure

Based on the Component based arhitecture each component should be isolated. Here is recommended structure that should follwing to have application components consistency

- `components/ComponentName/ComponentName.js` - where 'Component' is the name of the component that should be camelCased.
- `components/ComponentName/ComponentName.test.js` - tests for specific component
- `components/ComponentName/__stanpshots__` - tests generated stanpshots
