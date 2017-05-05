# Ballena Software Development Coding Exercise

This is a small problem we would like you to solve so we can get a sense of your coding abilities. Your code doesn't necessarily need to be production ready. However, it will need to be functional and run in our development environment. You are expected to spend around 4-6 hours on this exercise. This should give you enough time to formulate a good, working solution.

## The Problem
We want you to create a web based application that will calculate the ranking table for a soccer league.

## Rules
In this league, a draw (tie) is worth 1 point and a win is worth 3 points. A loss is worth 0 points. If two or more teams have the same number of points, they should have the same rank and be printed in alphabetical order (as in the tie for 3rd place in the sample data).
## Input/Output
The input contains results of games, one per line. See data-input.txt for details. Your application should parse the provided data-input.txt file server side and provide JSON as output that may be requested by the client side application and displayed in the client side application in a structured/tabular form. The output should be ordered from most to least points, following the format specified in data-output.txt.

## Requirements
* The solution should employ both client and serverside technologies.
* We would like you to implement with the tech stack used here at Ballena: PHP 5.6, JavaScript, HTML, CSS
* We prefer that you DO NOT use any PHP or JavaScript frameworks.
    * You are free to use jQuery and Bootstrap.
* The user interface should have the ability to upload a data file to the server.
* The user interface should be able to make an asynchronous call to the server to retrieve the ranking data and display it in a tabular fashion.
* The ranking table should be generated using server side code by parsing the data from the uploaded file.
* Data returned from the server should be in JSON.
* Include concise text documentation on how to use your application.

## The Finished Application
Please push your solution to the master branch in the provided github repository.

---
## Soccer League Scores and Ranking  

## Technologies Used  
* JavaScript
* HTML
* CSS
* Bootstrap
* jQuery
* Node
* Express

## Setup
* To get started, run `npm i` from the root of the project in a terminal window
* To start the server, run `npm start`
* Open a browser and navigate to [http://localhost:3000](http://localhost:3000)
* Upload a data file by clicking the `Choose Files` button and selecting the `data-input.txt` file

## Code
* server code in `server.js`
* client app code in `app.js`
