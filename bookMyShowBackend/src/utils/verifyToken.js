const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({
            status: false,
            message: "Token not provided"
        })
    }
    jwt.verify(token, "webdev24", (error, decode) => {
        if (error) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            })
        }
        req.user = decode;
        next();
    })

}

module.exports = verifyToken;