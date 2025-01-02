
//imports modules here

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


//import function here

import {createUsers, findUsers, getAllUsers} from "./user.model.js"

const allUser = (req, res)=>{
    const users = getAllUsers()
    res.status(200).json(users)
}

const signupUser = (req, res)=>{
    const { name, email, password} = req.body;

    const encryptPassword = bcrypt.hashSync(password, 5)
    const newUser = { name, email, password:encryptPassword}
    const user = createUsers(newUser)
    if(!user){
        res.status(400).json({
            status: "FAILED",
            msg:"User signup failed. Please try again!"
        })    
    }
    res.status(201).json({
        status: "Success",
        msg:user
    })
}

const loginUser = (req, res)=>{
    try{
        const {email, password} = req.body;
        
        const user = findUsers(email);
        
        if(!user){
            return res.status(400).json({
                status: "FAILED",
                msg:"User with the given email does not exist!"
            })
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch){
            return res.status(400).json({
                status: "FAILED",
                msg:"Invalid credentials!"
            })
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

    } catch(error){
        res.status(400).json({
            status: "FAILED",
            msg:`Something went wrong!`
        })
    }
}

export { allUser, signupUser, loginUser}