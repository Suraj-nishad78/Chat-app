import express from  "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import swaggerUi from "swagger-ui-express"
import { readFileSync } from "fs"
import {join, resolve} from "path"
import dotenv from "dotenv"
dotenv.config()

const app = express()

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(join(process.cwd(), 'public'))); 


//imports all routes here
import usersRoute from "./src/features/users/user.route.js"
import postRoute from "./src/features/post/post.route.js"
import commentRoute from "./src/features/comment/comment.route.js"
import likeRoute from "./src/features/like/like.route.js"

//imports middleware here
import {userAuth} from "./src/middleware/user.auth.js"
import logger from "./src/middleware/logger.middleware.js"
import {customErrorHandler, errorHandlerMiddleware} from "./src/middleware/errorHandler.middleware.js"

//Import swaggerJSON file
const swaggerJSONPath = resolve("./documentation/swagger.json");
const swaggerJSON = JSON.parse(readFileSync(swaggerJSONPath, "utf-8"));

app.use("/api", usersRoute)
app.use("/api/posts", userAuth, logger, postRoute)
app.use("/api/comments", userAuth, logger, commentRoute)
app.use("/api/likes", userAuth, logger, likeRoute)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJSON));

app.get("*", (req,res, next)=>{
    throw new customErrorHandler(404, `No route found for '${req.originalUrl}'`)
})

app.use(errorHandlerMiddleware)

app.listen(3000, ()=>{
    console.log("Server is up on 3000")
})