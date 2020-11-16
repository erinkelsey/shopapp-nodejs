# Shop App

An eCommerce app built with Node.js, Express, mongoDB, mongoose, and Stripe.

### Other Features

- Uses bcryptjs for hashing and salting passwords, and connect-mongodb-session and express-session for managing user sessions. - Uses csurf to create CSRF tokens, and prevent for CSRF Attacks.
- Uses connect-flash for sending messages on redirect responses.
- Users SendGrid, nodemailer, nodemailer-sendgrid-transport for sending emails.

## Install

    $ npm install

## Setup

### SendGrid

- Signup for a SendGrid account: https://sendgrid.com
- Create an API Key (Settings -> API Keys -> Create API Key)
- Give the API Key a name and Full Access for permissions
- Copy the key, and add to .env, as described below
- Verify sender identity by going to Settings -> Sender Authentication -> Single Sender Verification -> Create a Sender
- Create a sender with an email address you have access to, and confirm
- Add the email address you used to .env, as described below

### Environment Variables

Create a .env file in the main directory with the following environment variables:

    MONGODB_CONNECTION=your_mongo_connection_string
    SENDGRID_API_KEY=your_sendgrid_api_key
    SENDGRID_FROM=email_verified_sender_identity
    HOST_URL=http://localhost:3000

## Run

    $ npm start

## Sequelize Implementation

Check out the sequelize-implementation branch for the main app implemented using MySQL and the sequelize package.
