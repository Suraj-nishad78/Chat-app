
import jwt from "jsonwebtoken"

const userAuth = (req, res, next) =>{
    try{

        const token = req.cookies?.jwtToken;
        
        if(!token){
            return res.status(400).json({
                status: "FAILED",
                message: "You are not logged in. Please login again"
            })
        }

        const user = jwt.verify(token, process.env.SECRET_KEY)
        req.user = user;
        next();

    }catch(error){
        res.status(400).json({
            status: "FAILED",
            message: "You are not logged in. Please login again!"
        })
    }
}

export {userAuth}