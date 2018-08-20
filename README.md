# Qrvey Toggl - Time Tracking

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 5.0.0-rc.4.

## API Folder

API logic can be found in `/server/api/`

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) `npm install --global gulp`
- [yarn](https://yarnpkg.com/) `npm install --global yarn` (Optional)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `yarn install` or `npm install` to install server dependencies.

2. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

3. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Testing

Running `gulp test` will run the unit tests with karma.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.
