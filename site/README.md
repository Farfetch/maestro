# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Installation

```
$ yarn
```

## Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Working with images

Mostly all diagrams that are used inside documentation are created with [Tldraw](https://github.com/tldraw/tldraw). The sources can be found in the `./src/draws`.

To update the image simply edit the file by using [VSCode extension](https://github.com/tldraw/tldraw/tree/main/apps/vscode) or from website https://www.tldraw.com and store SVG to `./static/img/docs/`.

## Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
