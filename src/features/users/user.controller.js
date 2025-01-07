
//imports modules here

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


//import function here
import {createUsers, findUsers, getAllUsers} from "./user.model.js"
import {customErrorHandler} from "../../middleware/errorHandler.middleware.js"

const allUser = (req, res, next)=>{
    try{
        const users = getAllUsers()
        if(!(users && users.length)){
            throw new customErrorHandler(404, "No users found")
        }
        return res.status(200).json(users)
    } catch(err){
        next(err)
    }
}

const signupUser = (req, res, next)=>{
    try{
        const { name, email, password} = req.body;
        if(!name || !email || !password){
            throw new customErrorHandler(400, "Missing required fields: name, email, or password")
        }
        const encryptPassword = bcrypt.hashSync(password, 5)
        const newUser = { name, email, password:encryptPassword}
        const user = createUsers(newUser)

        res.status(201).json({
            status: "Success",
            msg:"User created successfully",
            user
        })
    } catch(err){
        next(err)
    }
}

const loginUser = (req, res, next)=>{
    try{
        const {email, password} = req.body;
        
        const user = findUsers(email);
        
        if(!user){
            throw new customErrorHandler(404, "User with the given email does not exist!")
        }
        
        const passwordMatch = bcrypt.compareSync(password, user.password)
        
        if(!passwordMatch){
            throw new customErrorHandler(400, "Invalid credentials!")
        }

        const token =  jwt.sign(user, process.env.SECRET_KEY, {expiresIn:'3m'})
        
        return res
        .cookie("jwtToken", token, { httpOnly: true, maxAge:  3 * 60 * 1000 })
        .status(200)
        .json({
            status: "Success",
            msg:`${user.name} is login successfully!`,
            token
        })

    } catch(err){
        next(err)
    }
}

export { allUser, signupUser, loginUser}