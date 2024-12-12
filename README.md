# My Northcoders News API BE Project 

## Description
A backend API designed for a news application, allowing users to interact with news articles, comments and user profiles. At the core, it allows users to search for users, topics, comments and articles and lets users interact with the database. This project is built with node.js and interacts with a PostgreSQL database, simulating the construction of a back-end server such as Reddit. The aim is to provide a robust, scalable backend to serve news data to the front end.

## Installation Instructions
1. **Clone the repository**
    clone the repo by pasting https://github.com/jayascodez/my-nc-news-beproject.git into the terminal
2. **Install Dependencies**
    run npm install to install dependancies/dev-dependancies
3. **Seed Local Database**
    run the npm setup-dbs script
    run the npm seed script 
4. **Setup Testing**
    run the npm prepare script
    run npm test to access tests

## Hosted Version
https://nc-news-be-project-1ajv.onrender.com/api.

Run npm start to run listen.js


## Creating .env Files
Create two .env files: .env.development and .env.test in the root and set the PGDATABASE=nc_news and PGDATABASE=nc_news_test respectively. 

## Versions
This was built using:
node v22.9.0
PostgreSQL 16.4

---------------------------

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
