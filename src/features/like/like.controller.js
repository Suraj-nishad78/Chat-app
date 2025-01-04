
import {allLikes, likeById, toggleLikePost} from "./like.model.js"
import { getAllPosts } from "../post/post.model.js"
import {customErrorHandler} from "../../middleware/errorHandler.middleware.js"


const getLikedPostById = (req, res, next) =>{
    try{
        const {postId} = req.params;
        const likedPost = likeById(Number(postId));
        if(!likedPost){
            throw new customErrorHandler(404, `No liked post was found for the post ID: ${postId}.`)
        }
        
        res.status(200).json({
            status:"Success",
            msg:`Like post`,
            postId,
            TotalLikes: likedPost.length
        })
    } catch (err){
        next(err)
    }
}

const toggleLike = (req, res, next) =>{
    const {postId} = req.params;
    let userId = req.user.id;

    const checkPostExist = getAllPosts().find(post=>post.id === Number(postId));

    if(!checkPostExist){
        throw new customErrorHandler(404, `The post with ID ${postId} does not exist in the system.`)
    }
    
    const likePost = toggleLikePost(Number(userId), Number(postId))
    
    if(!likePost){
        throw new customErrorHandler(200, `Like remove from this Post ID : ${postId}!`)
    }

    return res.status(201).json({
        status:"Success",
        msg:`You have liked the Post!`,
        likeDetails:likePost
    })
    
}

export { getLikedPostById, toggleLike}









