# Tickets Mobile API

A GraphQL API serving data from a Node.js application.

## Contents
- [Introduction](#Introduction)
- [Technologies](#Technologies)
- [Concepts](#Concepts)
- [Setup](#Setup)
- [Environment Variables](#Environment Variables)

## About

The backend for a movie ticketing app using GraphQL for the backend and React Native for the [frontend](https://github.com/edtha3rd/tickets-mob). This app will allow users to view movies, order tickets, select seats, and pay.

## Concepts
- Authentication and Authorization
  - Different users have different roles in the system which gives them privileges to perform different actions.
  - A user can sign up as an ADMIN, THEATER, or USER.
    - Signing up through the admin portal automatically assigns a user the role of THEATER.
    - Signing up through the mobile application automatically assigns a user the role of USER.
    - Admins are registered manually through the GraphQL playground.
  - **User Roles**
    - ADMIN
      - Signup and Login
      - Perform CRUD operations on movie objects.
      - Edit users.
      - Delete theaters and users.
      - Delete reservations.
      - View all movies in the database.
      - View which movies are showing at which locations.
      - View sales for each location.
    - THEATER
      - Signup and Login.
      - Add or remove movies from personal catalog.
      - View movie statistics.
      - Verify a reservation.
      - Edit account details such as address and phone number.
    - USER
      - Signup and Login.
      - Make a reservation for any available session.
      - Pay using a credit card through the Stripe API.
      - View past and active reservations.
      - Edit profile details.

## Technologies
**Backend**
- ExpressJS.
- GraphQL.
- JSON Web Token.
- bcryptjs
- Cloudinary (object storage).
- Mongoose.
- MongoDB (document storage).

## Concepts
- CRUD operations.
- Authentication and Authorization.
- State management.
- Password encryption.
- Images stored on Cloudinary.
- Functional Programming.
- React Hooks.

## Setup

> npm start

Runs the server in development mode.
Open `http://localhost:4321/tickets-api` to access the Apollo Studio in the browser to test GraphQL queries and mutations.

## Environment Variables
- API_URI=http://`${localhost}`:8080/tickets-api
- DB_URI= `MongoDB connection string`
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- CLOUDINARY_NAME
