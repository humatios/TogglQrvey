# Qrvey Toggl - Time Tracking

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## API Folder

API logic can be found in `/server/api/`

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [yarn](https://yarnpkg.com/) `npm install --global yarn` (Optional)
- [Gulp](http://gulpjs.com/) `npm install --global gulp`
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `yarn install` or `npm install` to install server dependencies.

2. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

3. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Testing

Running `gulp test` will run the unit tests with karma.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.

## Annotations

- Project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 5.0.0-rc.4.

- [Docker](https://www.docker.com/) for the containers of the application.

- [Travis](https://travis-ci.org/humatios/TogglQrvey) for the CI/CD.

- [GitFlow](https://github.com/nvie/gitflow), to manage the flow of branches in git when working with large groups.

- [Commitizen](http://commitizen.github.io/cz-cli/), to have commit for citizens

- [Automatic release](https://github.com/dominique-mueller/automatic-release), to automate changes between releases.
