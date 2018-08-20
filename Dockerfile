FROM node:8.11.4-jessie

MAINTAINER Jeremymarshall

RUN npm  install -g node-gyp gulp-cli

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

CMD [ "gulp", "serve" ]

EXPOSE 3000
