
import {getAllPosts, 
        userPosts, 
        getPostById,
        createPost, 
        updatePost,
        deletePost
        } from "./post.model.js"

const allPosts = (req, res) =>{
    const allPosts = getAllPosts()
    res.status(200).json(allPosts)
}

const createPosts = (req, res) =>{
    try{
        const {caption, imageUrl} = req.body;
        let userId = req.user.id;
        const newPost = {userId, caption, imageUrl}
        const postCreated = createPost(newPost)
        if(!postCreated){
            return res.status(400).json({
                status:"FAILED",
                msg:"Something went wrong!" 
            })
        }
    
        res.status(201).json({
            status:"success",
            msg:"Post created successfully!"
        })
    } catch(error){
        res.status(401).json({
            status:"FAILED",
            msg:"Posting failed!"
        })
    }
}

const userAllPosts = (req, res) =>{
    let userId = req.user.id;
    const posts = userPosts(Number(userId))
    if(!posts){
        return res.status(400).json({
            status:"FAILED",
            msg:"Something went wrong!" 
        })
    }

    res.status(200).json(posts)
}

const postById = (req, res) =>{
    const {id} = req.params;
    const post = getPostById(Number(id))

    if(!post){
        return res.status(400).json({
            status:"FAILED",
            msg:`The post with ID ${id} does not exist in the system.`
        })
    }

    res.status(200).json(post)
}

const userUpdatePost = (req, res) =>{
    const {id} = req.params;

    const updatedPost = updatePost(Number(id), req.body)

    if(!updatedPost) {
        return res.status(400).json({
            status:"FAILED",
            msg:`Post Updation failed!`
        })
    }

    res.status(200).json({
        status:"Success",
        msg:`Post Updated successfully!`,
        updatedPost:updatedPost
    })

}

const userDeletePost = (req, res) =>{
    const {id} = req.params;
    const postDeleted = deletePost(Number(id))
    if(!postDeleted){
        return res.status(400).json({
            status:"FAILED",
            msg:`The post with ID ${id} does not exist in the system.`
        })
    }
    res.status(200).json({
        status:"Success",
        msg:"Post deleted successfully",
        deletedPost:postDeleted
    })
}

export {allPosts, 
        postById, 
        createPosts, 
        userAllPosts, 
        userUpdatePost,
        userDeletePost
    }










