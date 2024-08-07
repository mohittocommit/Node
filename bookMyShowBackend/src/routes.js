const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router();
const bcrypt = require("bcrypt")
// Import the db connection
const db = require("./dbConnection")
const verifyToken = require("./utils/verifyToken")

// welcome api
router.get("/", (req, res) => {
    return res.send("Hello World!")
});
router.post("/api/register", async (req, res) => {
    const { name, email, phone, password } = req.body;

    /* password encryption */
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    db.query(`SELECT * FROM users where email='${email}'`, (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (result) {
            if (result.length > 0) {
                const response = {
                    message: "This email alredy exist",
                    status: false
                }
                return res.status(401).json(response)
            }
        }
    });

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

router.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const sqlQuery = `SELECT * FROM users WHERE email='${email}'`;
    db.query(sqlQuery, async (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (result) {
            if (result.length === 0) {
                const response = {
                    message: "Invalid login details!",
                    status: false
                }
                return res.status(401).json(response);
            }

            const hashPassword = result[0].password
            const match = await bcrypt.compare(password, hashPassword);

            if (match) {
                const payload = { email: email };
                const secretKey = "webdev24";
                const accessToken = await jwt.sign(payload, secretKey);
                const response = {
                    token: accessToken,
                    message: "Login Successfully",
                    status: true
                }
                return res.json(response)
            } else {
                const response = {
                    message: "Invalide login details!",
                    status: false
                }
                return res.status(401).json(response);
            }
        }
    })
})

router.get("/api/profile", verifyToken, (req, res) => {
    const { email } = req.user;
    db.query("SELECT * FROM users where email=?", [email], (error, result) => {
        if (error) {
            return res.status(500).send(error)
        }
        return res.json(result)
    })
})

router.post("/api/change_password", verifyToken, (req, res) => {

    const { currentPassword, newPassword } = req.body;

    console.log("req.body", req.body)
    const { email } = req.user;

    const sqlQuery = `SELECT * FROM users WHERE email='${email}'`;
    db.query(sqlQuery, async (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        if (result) {
            if (result.length === 0) {
                const response = {
                    message: "User Does not exist!",
                    status: false
                }
                return res.status(401).json(response);
            }
            console.log("result", result)

            const hashPassword = result[0].password
            const match = await bcrypt.compare(currentPassword, hashPassword);

            if (match) {
                /* password encryption */
                const salt = await bcrypt.genSaltSync(10);
                const hashNewPassword = await bcrypt.hashSync(newPassword, salt);

                const sqlQuery = `UPDATE users SET password = '${hashNewPassword}' WHERE email = '${email}'`;
                db.query(sqlQuery, async (error, result) => {
                    if (error) {
                        return res.status(500).send(error);
                    }
                    if (result) {
                        const response = {
                            message: "Password reset successfully",
                            status: true
                        }
                        return res.json(response)
                    }
                })
            } else {
                const response = {
                    message: "Old password is incorrect.!",
                    status: false
                }
                return res.status(401).json(response);
            }
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
