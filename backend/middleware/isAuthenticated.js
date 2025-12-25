import Jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
    if (!token) {
        return res.status(401).json
            ({
                message: "Unauthorized",
                success: false
            });
    }
    const decode = await Jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
        return res.status(401).json
            ({
                message: "invalid",
                success: false
            });
    }
    req.id = decode.userId;
    next();
     }
catch (error) {
    console.log(error);
       }

}
export default isAuthenticated;