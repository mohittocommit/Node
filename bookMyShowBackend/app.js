const express = require("express")
const bodyParser = require("body-parser"); // Middleware
const app = express();
const cors = require("cors");
const routes = require("./src/routes")


app.use(cors()); // Use this to allow all origins

// Add body parser as middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to set CORS headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use("/",routes)

const port = 9001;
app.listen(port, ()=> {
    console.log(`Server running at http://localhost:${port}`)
})


/*
    what is mocha & chai
*/