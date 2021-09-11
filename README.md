# blocksi_test_app
Test app for Blocksi job application

## Setup .env file
In root folder add .env file containing the following variables

* **MONGODB_URI** = {your MongoDB atlas link}

* **API_PORT** = {listening port number}

* **JWT_SECRET** = {unique string used for encoding JWT tokens}

## Starting the API
The API can be started by running the following commands

* ```npm install``` - to install all required dependencies

* ```npm run devStart``` - to start the development server

## Starting the Client app
The Vue app can be started by running the following commands

* ```npm install``` - to install all required dependencies

 and:

* ```npm run serve``` - to start the development build 
 
 or:

* ```npm run build``` - to build the minified production version
