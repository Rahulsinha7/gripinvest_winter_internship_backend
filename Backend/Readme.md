## Grip Invest - Backend
This repository contains the backend server for Grip Invest, a mini-investment platform. It is built with Node.js and Express.js and provides a complete RESTful API for user authentication, investment product management, and personal portfolio tracking. The server uses MongoDB for data storage and Redis for session management.

## Tech Stack
* Backend: 

Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose ODM

In-Memory Cache: Redis (for JWT blocklisting)

Authentication: JSON Web Tokens (JWT), bcrypt for hashing

Middleware: CORS, Cookie-Parser

* Frontend:

Library: React

State Management: Redux Toolkit (implied from authSlice)

Routing: React Router

Form Management: React Hook Form with Zod for validation

Styling: Tailwind CSS with DaisyUI

API Communication: Axios

## Frameworks & Libraries Used
This project leverages several key frameworks and libraries to ensure robust, secure, and efficient operation.

Library	Role	 Why It's Used
* Express.js	 Backend Framework	The core of the server. It provides a minimal and flexible framework for building the web application, handling routes,    requests, and middleware.
* Mongoose	     MongoDB ODM	Acts as an elegant Object Data Modeling (ODM) layer on top of MongoDB. It's used to create schemas for our User, Product, and Holding models, simplifying data validation and database interactions.
* Redis     	In-Memory Database	Used as a high-speed, in-memory data store. Its primary role in this project is to implement a JWT "blocklist," allowing for the immediate invalidation of tokens upon user logout for enhanced security.
* JSON Web Token (jsonwebtoken)	Authentication	Implements a standard method for securely transmitting information between parties as a JSON object. We use it to create access tokens for users, enabling stateless and secure authentication for protected API routes.
* bcrypt	   Password Hashing	A crucial security library used to hash user passwords before they are stored in the database. This ensures that even if the database is compromised, plaintext passwords are not exposed.
* CORS	      Middleware	A Node.js package for providing a Connect/Express middleware that can be used to enable Cross-Origin Resource Sharing with various options. It's essential for allowing your frontend (on a different origin) to communicate with this backend API.
* dotenv	 Environment Variables	A zero-dependency module that loads environment variables from a .env file into process.env. This is used to keep sensitive information like database connection strings and secret keys out of the main codebase.
* cookie-parser	Middleware	Used to parse the Cookie header and populate req.cookies with an object keyed by the cookie names. This makes it easy to handle the JWT sent from the client in an HTTP-only cookie.

## API Endpoints for Postman Collection.
The API is structured into three main resources: User, Product, and Holding.

### User Authentication & Management (/user)
Endpoint	            Method 	Access	       Description
/register	             POST	Public	Registers a new standard user on the platform.
/login     	             POST	Public	Authenticates a user and returns an HTTP-only cookie with a JWT.
/logout	                 POST	User	Logs out the current user and blocklists their JWT in Redis.
/check	                 GET	User	Verifies the user's token and returns their basic profile data.
/deleteProfile	        DELETE	User	Deletes the profile of the currently authenticated user.
/forgot-password	     POST	Public	Initiates the password reset process by sending an OTP.
/verify-otp            	 POST	Public	Verifies the password reset OTP provided by the user.
/reset-password	         POST	Public	Sets a new password for the user after successful OTP verification.
/admin/register    	     POST	Admin	Registers a new user with an 'admin' role.
### Product Management (/product)
Endpoint	         Method	Access	Description
/create        	     POST	Admin	Creates a new investment product.
/update/:id	         PUT	Admin	Updates the details of a specific product by its ID.
/delete/:id     	DELETE	Admin	Deletes a product from the platform by its ID.
/productById/:id	 GET	User	Fetches the complete details for a single product.
/getAllProduct     	 GET	User	Retrieves a list of all available investment products.
### Holding & Portfolio Management (/holding)
Endpoint	       Method	Access	Description
/buy	            POST	User	Allows an authenticated user to buy a product, creating a new holding.
/sell/:holdingId	PUT 	User	Allows a user to sell a holding they own.
/portfolio	        GET 	User	Fetches the complete investment portfolio for the authenticated user.
## Getting Started
To get a local copy up and running, follow these simple steps.

### Prerequisites
Node.js (v18 or later)

npm

MongoDB instance (local or cloud-based)

Redis instance (local or cloud-based)

### Installation
Clone the repository

Bash

git clone https://github.com/your_username/grip-invest-backend.git
Navigate to the project directory

Bash

* Backend->
cd Grip_Invest backend
Install NPM packages
* run the backend server- nodemon/src index.js

* Frontend->
cd Grip_Invest frontend
Install NPM packages
*  To run the frontend- npm run dev


# Server Configuration
PORT=3000

# Admin Access
emailId- rahulkumarsinha7112@gmail.com
password-Rahul@123
