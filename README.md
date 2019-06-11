# BOWSER

It is a API server application

## Requirements

The project uses MongoDB as a database.Before use this application you should download and install [MongoDB](https://www.mongodb.com/download-center/community) on your computer. If you are on Mac and using Homebrew package manager the installation is as simple as `brew install mongodb`.

## Getting Started

To get you started you can simply clone the repository:

```
git clone https://github.com/ave-mario/bowser.git
```

Before installing, download and install [Node.js](https://nodejs.org/en/). After install the dependencies

```
npm install
```

## Run the Application

The project is preconfigured with a simple development web server. The simplest way to start this server is:

```
npm start
```

## Run the Test

To run the test suite you should choose one variant:

```
npm run e2e - Running intergation tests
npm run e2e:coverage - Running test with coverage information will be collected and reported in the output.
npm run e2e:watch - Running test and watching files for changes and rerun tests related to changed files.
```

## Run the build application

```
npm run build
```
