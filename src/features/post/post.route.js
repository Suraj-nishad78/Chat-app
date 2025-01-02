import express from "express"

const router = express.Router()

//Imports all function here
import{ allPosts, 
        postById,
        createPosts, 
        userAllPosts, 
        userUpdatePost,
        userDeletePost 
      } from "./post.controller.js"


router.get("/all", allPosts)
router.get("/", userAllPosts)
router.get("/:id", postById)
router.post("/", createPosts)
router.put("/:id", userUpdatePost)
router.delete("/:id", userDeletePost)

export default router
