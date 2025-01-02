
import {allCommnets, 
        commentsById,
        postComment,
        updateComment,
        deleteComment
      } from "./comment.model.js"

import { getAllPosts } from "../post/post.model.js"     


const getCommentByPid = (req, res) =>{
    const {pId} = req.params;
    const postId = Number(pId);
    const comments = commentsById(postId)

    if(!comments){
        return res.status(400).json({
            status:"FAILED",
            msg:"Something went wrong! Please try again."
        })
    }

    res.status(200).json(comments)

}

const postCommentById = (req, res) =>{
    const {pId} = req.params;
    const postId = Number(pId);
    const userId = Number(req.user.id);
    const content = req.body;

    const comment = {userId, postId, ...content}

    const checkPostId = getAllPosts().find(post=> post.id === Number(postId))

    if(!checkPostId){
        return res.status(400).json({
            status:"FAILED",
            msg:`The post with ID ${postId} does not exist in the system.`
        })
    }

    const commented = postComment(comment)

    if(!commented){
        return res.status(400).json({
            status:"FAILED",
            msg:"Something went wrong! Please try again."
        })
    }

    return res.status(201).json({
        status:"Success",
        msg:"Commented Successfully!",
        comment:commented
    })
}

const updateCommentById = (req, res) =>{
    const{id} = req.params;

    const checkCommentExist = allCommnets().find(comment => comment.id === Number(id))

    if(!checkCommentExist){
        return res.status(400).json({
            status:"FAILED",
            msg:`The comment with ID ${id} does not exist in the system.`
        })        
    }

    const userId = Number(req.user.id)
    const checkUser = allCommnets().find(comment => comment.id === Number(id) && comment.userId === userId)

    if(!checkUser){
        return res.status(400).json({
            status:"FAILED",
            msg:`You are not allowed to Update the comment`
        })
    }

    const commentUpdate = updateComment(Number(id), req.body)

    if(!commentUpdate){
        return res.status(400).json({
            status:"FAILED",
            msg:"Something went wrong! Please try again."
        })
    }

    res.status(200).json({
        status:"Success",
        msg:"Comment Updated Successfully!",
        updatedComment:commentUpdate
    })
}

const deleteCommentById = (req, res) =>{
    const {id} = req.params;

    const checkCommentExist = allCommnets().find(comment => comment.id === Number(id))

    if(!checkCommentExist){
        return res.status(400).json({
            status:"FAILED",
            msg:`The comment with ID ${id} does not exist in the system.`
        })        
    }

    const userId = Number(req.user.id)
    const checkUser = allCommnets().find(comment => comment.id === Number(id) && comment.userId === userId)

    if(!checkUser){
        return res.status(400).json({
            status:"FAILED",
            msg:`You are not allowed to Delete the comment`
        })
    }

    const commentDeleted = deleteComment(Number(id))

    res.status(200).json({
        status:"Success",
        msg:"Comment deleted Successfully!",
        deletedComment:commentDeleted
    })
}

export {getCommentByPid, 
        postCommentById,
        updateCommentById,
        deleteCommentById
    }