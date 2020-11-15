# Shop App

An eCommerce app built with Node.js, Express, mongoDB, mongoose, and Stripe. Uses bcryptjs for hashing and salting passwords, and connect-mongodb-session and express-session for managing user sessions. Uses csurf to create CSRF tokens, and prevent for CSRF Attacks. Uses connect-flash for sending messages on redirect responses.

## Install

    $ npm install

## Setup

### Environment Variables

Create a .env file in the main directory with the following environment variables:

    MONGODB_CONNECTION=your_mongo_connection_string

## Run

    $ npm start

## Sequelize Implementation

Check out the sequelize-implementation branch for the main app implemented using MySQL and the sequelize package.
