// the index.js file represents our JS file

// Require the express module:
const express = require('express');

// Require the mysql module:
const mysql = require('mysql');

// Like with flask python framework and nodeJS, define app object:
const app = express(); // could any other name you like

/*
We might need to use or run the application in different places, so it's good to save it into a variable
We can name it "port" or "PORT" in capital by convention
*/
const PORT = 3000; // defining the port number to be 3000 as a convention based on Express Docs

// You will see this: Cannot GET /

// Create the connection
// using .createConnection() methods that takes a configuration object
const dbCon = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    // we will create this database through our application first,
    // Then activate the following property after creating our database:
    database: "node_mysql"
});

// make the connection:
/*
Either by using a callback anonymous function
or using ES6 which is an arrow function
*/
/*
dbCon.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
*/

dbCon.connect((err) => {
    // Check if there is an error
    if (err) {
        throw err;
    }
    console.log("MySQL Connection is DONE!");
});

/*
Notice that we will have an error as our database is not created yet!
but will create it in the next lines:
*/

// Create a route to our database creation code:
// Using a get() request:
app.get('/db', (req, res) => {
    // testing:
    console.log("Access DB Route page");
    // create the SQL query:
    let sql = 'CREATE DATABASE if not exists node_mysql';
    dbCon.query(sql, (error, result) => {
        if (error) {
            console.log(error.message);
            throw error;
        }
        // for testing:
        console.log(result);
        res.send('A new database was created!');
    });
});

// After creating a database, we will create a table using another route:
app.get('/users', (req, res) => {
    const sql = 'CREATE TABLE users(user_id INT AUTO_INCREMENT, first_name VARCHAR(40), last_name VARCHAR(40), email VARCHAR(50), PRIMARY KEY(user_id))';
    dbCon.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
        res.send('users table is created!');
    });
});

// Insert a user:
app.get('/adduser', (req, res) => {
    // creating an object:
    // let user = { first_name: 'Alex', last_name: 'Chow', email: 'alexchow@yahoo.ca'};
    let firstName = 'Alex';
    let lastName = 'Chow';
    let email = 'alexchow@yahoo.ca';
    // To pass data to an SQL statement, you use the question marks (?) as the placeholders.
    // acting as a prepared statement
    const sql = `INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?);`;

    // Creating queries 
    dbCon.query(sql, [firstName, lastName, email], (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
        res.send('One user was inserted');
    });
});

// Select:
app.get('/selectall', (req, res) => {
    const sql = `SELECT * FROM users`;

    // Creating queries 
    dbCon.query(sql, (err, records) => {
        if (err) {
            throw err;
        }
        console.log(records);
        res.send('All users');
    });
});

// Select individual user:
// passing the id as parameter
app.get('/select/:id', (req, res) => {
    const sql = `SELECT * FROM users WHERE user_id= ${req.params.id}`;
    // Creating queries 
    dbCon.query(sql, (err, record) => {
        if (err) {
            throw err;
        }
        console.log(record);
        res.send('One user');
    });
});

// Update User:
app.get('/update/:id', (req, res) => {
    let last_name = "Johnson"
    const sql = `UPDATE users SET last_name = '${last_name}' WHERE user_id= ${req.params.id}`;
    // Creating queries 
    dbCon.query(sql, (err, record) => {
        if (err) {
            throw err;
        }
        console.log(record);
        res.send('One record was updated');
    });
});

// Delete User:
app.get('/delete/:id', (req, res) => {
    const sql = `DELETE FROM users WHERE user_id= ${req.params.id}`;
    // Creating queries 
    dbCon.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
        res.send('One record was deleted');
    });
});

// This line is boilerplate code from Express docs to run our server:
// using the method listen() of "app" object that takes two parameters:
// 1- Port Number
// 2- A function (Using Anonymous Arrow Function)
app.listen(PORT, () => {
    // Notice that console.log() will output the data on the server side as we are using node.js
    // It's not like console.log() for outputting the data on the console window of the browser
    // In the next sections, we will need to transfer the data from the server to the client's browser
    console.log(`Express App Server listening on port ${PORT} and the local server URL: http://localhost:3000/`);
});
