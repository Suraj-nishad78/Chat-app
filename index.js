import express from  "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
dotenv.config()

const app = express()

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//imports all roures here
import usersRoute from "./src/features/users/user.route.js"
import postRoute from "./src/features/post/post.route.js"
import commentRoute from "./src/features/comment/comment.route.js"

//imports middleware here
import {userAuth} from "./src/middleware/user.auth.js"


app.use("/api", usersRoute)
app.use("/api/posts", userAuth, postRoute)
app.use("/api/comments", userAuth, commentRoute)

app.get("/", (req, res)=>{
    res.send("Hello Chat ups")
})

app.listen(3000, ()=>{
    console.log("Server is up on 3000")
})