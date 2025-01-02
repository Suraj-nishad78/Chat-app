import express from "express"

const router = express.Router()

//Imports all function here
import {
    getCommentByPid, 
    postCommentById,
    updateCommentById,
    deleteCommentById
    } from "./comment.controller.js"

router.get("/:pId", getCommentByPid)
router.post("/:pId", postCommentById)
router.put("/:id", updateCommentById)
router.delete("/:id", deleteCommentById)

export default router