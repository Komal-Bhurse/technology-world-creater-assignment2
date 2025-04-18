Technology World Creater 

Multi-User Registration System with Role-Based Access

Objective:
Design and build a backend system to support the registration and login of two types of users:

User Type 1: Service Center Partner (SCP)

User Type 2: Farmers (registered by SCP through their portal)

Background Example Use Case:
Service Center Partners (User 1) sign up and get access to their dashboard. Within their portal, they can
register Farmers (User 2) on their behalf. Farmers do not self-register.


Task Description:
1. User 1 (SCP) Registration & Login:


Create API endpoints for
SCP Registration (collect: Name, Email, Password, Phone
SCP Login (Email, Password)

On successful login, SCP receives an auth token (JWT or session-based).


2. SCP Portal Functionality:


After login, SCP can
Access a protected route /dashboar
Use an endpoint to register Farmers (User 2) from their account
Farmer details to collect: Name, Phone Number, Village Name, Crop Typ
Retrieve a list of all registered farmers linked to that SCP.


3. User Type 2 (Farmer)
Farmers do not login
Their records are only accessible and manageable through the SCP account that registered them.

Tech used:

React Js , Bootstrap , Node Js , Express Js , Mongodb

Authentication: JWT - json-web-token

Role Based access Controll : YES 

Password Security: bcrypt 

API Testing Tool: Postman 


----------How To Start--------------
1. clone the repo

2. add .env file in Root Folder and inside it add a below variables 
   DB_URI = "Your Mongo db url"
   JWT_SECRET_KEY = " jwt secrete key"
   
4. In Root folder "/" exicute - command : "npm i" to install the required packeges first

5. navigate to frontend folder /frontend and exicute - command : "npm i " to install the required packeges for frontend

6. now Build the Frontend  using - exicute - "npm run build"

7 .next Navigate to root folder and - exicute the command - "npm start" it will give you a http://localhost:5000 that you can check in localy 



