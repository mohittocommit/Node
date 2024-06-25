const mysql = require("mysql2")

// Create DB Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bookmyshow"
})
db.connect((error)=> {
    if(error) {
        console.log("Error connecting to the database",err);
        return;
    }
    console.log("Connected to the database successfully!");
})

module.exports = db;