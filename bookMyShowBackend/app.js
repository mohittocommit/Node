const express = require("express")
const app = express();
const routes = require("./src/routes")


app.use("/",routes)


const port = 9001;
app.listen(port, ()=> {
    console.log(`Server running at http://localhost:${port}`)
})


/*
    what is mocha & chai
*/