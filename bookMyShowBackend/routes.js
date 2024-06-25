const express = require("express")
const router = express.Router();
// Import the db connection
const db = require("./dbConnection")


router.get("/",(req,res)=> {
    return res.send("Hello World!")
});
router.get("/users",(req,res)=>{
    db.query("SELECT * FROM employee",(error,result)=>{
        if(error){
            return res.status(500).send(error);
        }
        return res.json(result);
    })
})

module.exports = router;
