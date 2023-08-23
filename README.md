# Introduction
Our Ecommerce website is built using Node.js, Express, and MySQL. It offers user authentication, account confirmation, and the ability for users to choose discount prices during the checkout process.



# Features
User Registration: Users can sign up by providing their email addresses and creating a password.


Account Confirmation: Users will receive a confirmation email with a unique link to activate their accounts.


Discount Selection: Users can select from available discount options when making a purchase.


Product Catalog: Showcase a variety of products for users to explore.


Secure Checkout: A secure checkout process ensures safe transactions.



#  Prerequisites
Node.js and npm installed on your system.


A MySQL database instance.


# Installation


Clone this repository: git clone https://github.com/your-username (in my case ifeomagoody) /ecommerce-website.git


Navigate to the project directory: cd ecommerce-website


Install dependencies: npm install


#  Configuration


Rename config.example.js to config.js.


Open config.js and provide your MySQL database configuration.


# Usage


Run the application: npm start


Open your web browser and navigate to http://localhost:8080, depending on the localhost port number you picked


# User Registration and Account Confirmation


Register: Click on "Sign Up" and provide your email and password.


Confirmation: Check your email for a confirmation link. Clicking the link confirms your account.



#  Choosing Discount Prices


Browse: Explore the product catalog.


Add to Cart: Select products and add them to your cart.


Checkout: Proceed to checkout and select a discount option before making payment.


# Database


We use MySQL for the database. Check the database.sql file for the database schema.