import express from "express"

const router = express.Router()

//Imports all function here
import {allUser, signupUser, loginUser} from "./user.controller.js"

router.get("/users", allUser)
router.post("/signup", signupUser)
router.post("/signin", loginUser)

export default router