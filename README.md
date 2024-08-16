# Ecommerce-project

# Overview
This project includes a Node.js backend and a Next.js 14 frontend, creating a full-stack e-commerce platform. The backend is built with Node.js v20.3.1 and uses PostgreSQL as the database. The frontend, located in the frontend folder, interacts with the backend through a set of APIs, enabling a seamless user experience on the platform


# Getting Started
To use this backend, you will need to install the following dependencies:

Node.js v20.3.1
PostgreSQL
```
npm install
```

Once you have installed the dependencies, you can start the backend by running the following command:
```
node server.js
```
For the frontend, navigate to the frontend directory and install the dependencies:

bash
```
cd frontend
npm install
```
This will start the backend on port 3002. You can then access the APIs by making HTTP requests to the backend.


### APIs
POST /api/cart/addInCart: This API allows a user to add a product to their cart.

-  **DELETE /api/cart/removeFromCart:** This API allows a user to remove a product from their cart.

-  **GET /api/cart/getCart:** This API returns the cart contents of the logged-in user.

-   **POST /api/cart/addInCart:** This API allows a buyer to add a product in the cart.

-  **PUT /api/products/edit/:id:** This API allows a seller to edit their product. (e.g., PUT /api/products/edit/6)

-  **GET /api/products/search:** This API allows users to search for products based on a search term. The search query should be passed as a query parameter

-  **GET /api/products/list:** This API lists all the products which are available for the users

- **GET /api/products/listSellerProducts:** This API lists products of a particular seller

-  **DELETE /api/products/delete/:id:** This API allows a seller to delete their product. (e.g., DELETE /api/products/delete/7)

-  **POST /api/products/create:** This API allows a buyer to create a new product.

-  **POST /api/auth/login:** This API is used to log in an existing user. It returns a JWT token for authentication.

-  **POST /api/auth/register:** This API is used to register a new user.


### Database setup
This project uses a custom schema for organizing the database structure. To set up the database, follow the instructions below:

# Step 1: Create the Database
First, create the database that will hold your e-commerce data:


```sql
 CREATE DATABASE "e-commerce";
```

# Step 2: Run the schema.sql Script
After creating the database, run the schema.sql file to set up the schema and tables. This file contains all the necessary SQL commands to create the required tables and structure.

Using psql:

```sql
psql -U your_username -d e-commerce -f path/to/schema.sql
```
Replace your_username with your PostgreSQL username, and path/to/schema.sql with the relative or absolute path to the schema.sql file.

This command will execute all the SQL commands in the schema.sql file, creating the necessary schema and tables in the ecommerce_db database.

