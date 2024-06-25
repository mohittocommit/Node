const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt")
// Import the db connection
const db = require("./dbConnection")


router.get("/", (req, res) => {
    return res.send("Hello World!")
});
router.post("/api/register", async (req, res) => {
    const { name, email, phone, password } = req.query;

    /* password encryption */
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    const sqlQuery = `INSERT INTO users(name,email,phone,password) VALUES(?,?,?,?)`;

    db.query(sqlQuery, [name, email, phone, hashPassword], (error, result) => {
        if (error) {
            res.status(500).send(error);
        }
        if (result) {
            const response = {
                message: "Your account has been created successfully",
                status: true
            }
            return res.json(response)
        }

    })
})
router.get("/api/users", (req, res) => {
    db.query("SELECT * FROM users", (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        return res.json(result);
    })
})

module.exports = router;
