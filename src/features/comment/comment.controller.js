
import {allCommnets, 
        commentsById,
        postComment,
        updateComment,
        deleteComment
      } from "./comment.model.js"
import { getAllPosts } from "../post/post.model.js"     
import {customErrorHandler} from "../../middleware/errorHandler.middleware.js"


const getCommentByPid = (req, res, next) =>{
    try{

        const {pId} = req.params;
        const postId = Number(pId);
        const comments = commentsById(postId)
        const comment = comments.map(com => com.content)
    
        if(!comments.length){
            throw new customErrorHandler(404, `No comment found with given Post Id: ${postId}`)
        }


        const getPost = getAllPosts().find(post => post.id === postId)
        // const post = getAllPosts().map(post=>{
        //     return {
        //         ...post,
        //         "Post Comments": comment
        //     }
        // })
        const post = {
            ...getPost,
            "Post Comments": comment
        }
    
        res.status(200).json(post)
    }catch(err){
        next(err)
    }

}

const postCommentById = (req, res, next) =>{
    try{
        const {pId} = req.params;
        const postId = Number(pId);
        const userId = Number(req.user.id);
        const {content} = req.body;

        if(!content) {
            throw new customErrorHandler(400, "Missing required fields: content!")
        }

        const comment = {userId, postId, content}

        const checkPostId = getAllPosts().find(post=> post.id === Number(postId))

        if(!checkPostId){
            throw new customErrorHandler(404, `The post with ID ${postId} does not exist in the system.`)
        }
        const commented = postComment(comment)

        if(!commented){
            throw new customErrorHandler(400, "Something went wrong! Please try again.")
        }

        res.status(201).json({
            status:"Success",
            msg:"Commented Successfully!",
            comment:commented
        })
    }catch(err){
        next(err)
    }
    
}

const updateCommentById = (req, res, next) =>{
    try{
        const{id} = req.params;
        const checkCommentExist = allCommnets().find(comment => comment.id === Number(id))
        if(!checkCommentExist){  
            throw new customErrorHandler(404, `The comment with ID does not exist in the system.`)
        }
        
        const userId = Number(req.user.id)
        const checkUser = allCommnets().find(comment => comment.id === Number(id) && comment.userId === userId)
        
        if(!checkUser){
            throw new customErrorHandler(400, `You are not allowed to Update the comment`)
        }
        
        const commentUpdate = updateComment(Number(id), req.body)
    
        if(!commentUpdate){
            throw new customErrorHandler(400, "Something went wrong! Please try again.")
        }
        
        res.status(200).json({
            status:"Success",
            msg:"Comment Updated Successfully!",
            updatedComment:commentUpdate
        })
        
    } catch(err){
        next(err)
    }
}

const deleteCommentById = (req, res, next) =>{
    try{
        const {id} = req.params;
        const checkCommentExist = allCommnets().find(comment => comment.id === Number(id))
        
        if(!checkCommentExist){  
            throw new customErrorHandler(400, `The comment with ID ${id} does not exist in the system.`)
        }
        
        const userId = Number(req.user.id)
        const checkUser = allCommnets().find(comment => comment.id === Number(id) && comment.userId === userId)
    
        if(!checkUser){
            throw new customErrorHandler(400, `You are not allowed to Delete the comment`)
        }
    
        const commentDeleted = deleteComment(Number(id))
    
        res.status(200).json({
            status:"Success",
            msg:"Comment deleted Successfully!",
            deletedComment:commentDeleted
        })
    } catch (err){
        next(err)
    }
}

export {getCommentByPid, 
        postCommentById,
        updateCommentById,
        deleteCommentById
    }