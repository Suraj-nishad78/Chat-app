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
 
import { upload } from "../../middleware/multer.js"


router.get("/all", allPosts)
router.get("/", userAllPosts)
router.get("/:id", postById)
router.post("/", upload.single('imageUrl'), createPosts)
router.put("/:id", upload.single('imageUrl'), userUpdatePost)
router.delete("/:id", userDeletePost)

export default router
