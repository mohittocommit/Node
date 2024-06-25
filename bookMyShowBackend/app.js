const express = require("express")
const app = express();
const routes = require("./routes")


app.use("/",routes)


const port = 9001;
app.listen(port, ()=> {
    console.log(`Server running at http://localhost:${port}`)
})


/*
    what is dotenv in package
    what is mocha & chai
    nodemon not working
*/