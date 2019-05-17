# Becode - Group Work - online videogame - Super Socket fighter

*May 2019*

> 🔨 Group work to learn how to use node.js (server-side) and websockets (Socket IO)

* * *

## Group

[Vincent Chilot](https://github.com/Raigyo)

[Matthieu Jasselette](https://github.com/MatthieuJasselette)

## About

The goal of this exercise was to learn socket IO and real-time, bidirectional and event-based communication between the browser and the server.

According the rules of the exercise the server-side technologies were mandatory. The ones for the front-end part were free.

* Node.JS (server-side)
* Websockets/Socket IO (server-side)
* React JS (client-side)

## Installation

You will need [node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed on your computer.

**To play localy**

In *servers.js* (root) replace

`_endpoint: undefined, //Heroku_`
by:
`_endpoint: "localhost:8000", //Local_`

* Use `node server.js` in the *root* to launch the server
* Use `npm start` in the directory *socket-client*

**To build the app for Heroku:**

You will need this command line in package.json:

`"build": "cd socket-client && npm install && npm run build"`

In the root:
* `npm install` to install dependencies
* `npm run build` to build for production

## How to play?

* Insert your name then create or join a room
* ...
* Play!

See the [rules](https://www.youtube.com/watch?v=_PUEoDYpUyQ) of *Rock, Paper, Scissors, Lizard, Spock* explained by Sheldon Cooper.

## Demo

[See demo on Heroku](https://supersocketfighter.herokuapp.com/)

## Note

**Sprites sheets and sound effects are the property of Capcom and are used for demonstration purpose only**
