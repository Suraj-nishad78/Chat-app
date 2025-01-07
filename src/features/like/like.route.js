import express from "express"

const router = express.Router()

//Imports all function here
import { getLikedPostById, toggleLike} from "./like.controller.js"

router.get("/:postId", getLikedPostById)
router.get("/toggle/:postId", toggleLike)

export default router
