
import path from "path"

import {getAllPosts, 
        userPosts, 
        getPostById,
        createPost, 
        updatePost,
        deletePost,
        changePostStatus,
        draftAndArchivePost,
        postEngagement
        } from "./post.model.js"
import {customErrorHandler} from "../../middleware/errorHandler.middleware.js"
import {getAllUsers, addBookmarkInUser} from "../../features/users/user.model.js"

const allPosts = (req, res) =>{
    const {limit = 10, offset = 0} =  req.query;
    const allPosts = getAllPosts().filter(post => post.status === "active")
    if(!allPosts.length){
        return res.status(200).json({
            status:"Success",
            msg:"No post found in the system" 
        })
    }
    const posts = allPosts.slice(Number(offset), Number(offset) + Number(limit))
    res.status(200).json(posts)
}

const createPosts = (req, res, next) =>{
    try{
        const {caption} = req.body;
        let userId = req.user.id;
        const{ file} = req;
        const date = new Date().toISOString();

        if(!caption || !file){
            throw new customErrorHandler(400, "Missing required fields: caption & file")
        }

        const newPost = {userId, caption, imageUrl:file.filename, status: "active", postingDate: date}
        const postCreated = createPost(newPost)

        if(!postCreated){
            throw new customErrorHandler(400, "Posting Failed. Please try again!")
        }
    
        res.status(201).json({
            status:"success",
            msg:"Post created successfully!",
            post:postCreated
        })

    } catch(err){
        next(err)
    }
}

const userAllPosts = (req, res, next) =>{
    try{
        let userId = req.user.id;
        const posts = userPosts(Number(userId))
        if(!posts.length){
            throw new customErrorHandler(400, "Please login first!")
        }
    
        res.status(200).json(posts)
    } catch(err){
        next(err)
    }
}

const postById = (req, res, next) =>{
    try{
        const {id} = req.params;
        let userId = Number(req.user.id);
        const post = getPostById(Number(id))
    
        if(!post){
            throw new customErrorHandler(400, `The post with ID ${id} does not exist in the system.`)
        }
        
        if(post.status !== "active" && post.userId !== userId){
            throw new customErrorHandler(400, `Yor are not allowed to see this post using Post id: ${id}`)
        }
    
        res.status(200).json(post)
    } catch(err){
        next(err)
    }
}

const userUpdatePost = (req, res, next) =>{
    try{

        const {id} = req.params;
        const checkPostExist = getAllPosts().find(post=>post.id === Number(id))    
        if(!checkPostExist) {
            throw new customErrorHandler(404, `The post with ID ${id} does not exist in the system.`)
        }
        
        let userId = Number(req.user.id);
        const checkUserExist = getAllPosts().find(post=>post.id === Number(id) && post.userId === userId)
    
        if(!checkUserExist) {
            throw new customErrorHandler(400, `You are not allowed to update this post!`)
        }
        
        
        const {caption} = req.body;
        const{ file} = req;

        if(!caption || !file){
            throw new customErrorHandler(400, "Missing required fields: caption & file")
        }

        const updateData = { caption, imageUrl:file.filename}
        const updatedPost = updatePost(Number(id), updateData)
    
        if(!updatedPost) {
            throw new customErrorHandler(400, `Post Updation failed!`)
        }
    
        res.status(200).json({
            status:"Success",
            msg:`Post Updated successfully!`,
            updatedPost:updatedPost
        })
    } catch (err){
        next(err)
    }

}

const userDeletePost = (req, res, next) =>{

    try{
        const {id} = req.params;
        const checkPostExist = getAllPosts().find(post=>post.id === Number(id))
        if(!checkPostExist) {
            throw new customErrorHandler(404, `The post with ID ${id} does not exist in the system.`)
        }
        
        let userId = Number(req.user.id);
        const checkUserExist = getAllPosts().find(post=>post.id === Number(id) && post.userId === userId)
        
        if(!checkUserExist) {
            throw new customErrorHandler(400, `You are not allowed to delete this post!`)
        }
        
        const postDeleted = deletePost(Number(id))
        if(!postDeleted){
            throw new customErrorHandler(400, "Something went wrong. Please try again!")
        }
        res.status(200).json({
            status:"Success",
            msg:"Post deleted successfully",
            deletedPost:postDeleted
        })

    } catch(err){
        next(err)
    }
}

const getPostByCaption = (req, res, next) =>{
    try{
        const {caption} = req.params;
        const query = caption.toLowerCase();
        const postByCapion = getAllPosts().filter(post=> post.caption.toLowerCase().includes(query))
        
        if(!postByCapion.length){
            throw new customErrorHandler(404, `No post found with given query: ${query}`)
        }
        res.status(200).json(postByCapion)
    } catch(err){
        next(err)
    } 
} 

const bookmarkAdd = (req, res, next) =>{
    try{
        const {pId} = req.params;
    
        const checkExistPost = getAllPosts().find(post => post.id === Number(pId))
    
        if(!checkExistPost){
            throw new customErrorHandler(404, `The post with ID ${pId} does not exist in the system.`)        
        }
        
        let userId = Number(req.user.id);
        const postId = Number(pId) 
        const bookmarkAdded = addBookmarkInUser(userId, postId)
        
        if(!bookmarkAdded){
            throw new customErrorHandler(400, "Something Went wrong. Please try again!")
        }
        
        res.status(200).json({
            status:"Success",
            msg:`Bookmark added successfully with given Post Id: ${postId}`
        })

    } catch(err){
        next(err)
    }
    
}

const getBookmark = (req, res, next) =>{
    try {
        let userId = Number(req.user.id);
        const findUser = getAllUsers().find(user => user.id === userId)

        if(!findUser.bookmark){
            throw new customErrorHandler(404, "You don't have any bookmarks yet!")
        }

        const bookmarkIds = findUser.bookmark.map(book => book.postId);
        const bookmarks = getAllPosts().filter(post => bookmarkIds.includes(post.id));

        res.status(200).json({
            status:"Success",
            msg:"Bookmarks are listed here!",
            bookmarks
        })

    } catch(err){
        next(err)
    } 
}

const draftPost = (req, res, next) =>{
    try{
        const {pId} = req.params;    
        const checkExistPost = getAllPosts().find(post => post.id === Number(pId))
    
        if(!checkExistPost){
            throw new customErrorHandler(404, `The post with ID ${pId} does not exist in the system.`)        
        }
        
        let userId = Number(req.user.id);
        const postId = Number(pId)
        
        const checkPostOwner = getAllPosts().find(post => post.id === Number(pId) && post.userId === userId )
        
        if(!checkPostOwner){
            throw new customErrorHandler(400, `You are not allowed to draft this post`)
        }

        const status = "draft"
        const statusChange = changePostStatus(postId, status)

        if(!statusChange){
            throw new customErrorHandler(400, "Something Went wrong. Post draft failed")
        }
        
        res.status(200).json({
            status:"Success",
            msg:`Post drafted successfully with given Post Id: ${postId}`
        })

    } catch(err){
        next(err)
    }
}


const getDraftPost = (req, res, next) =>{
    try{

        let userId = Number(req.user.id);
        const status = "draft"
        
        const draftPosts = draftAndArchivePost(userId, status)
        
        if(!draftPosts.length){
            throw new customErrorHandler(400, "You don't have any drafts yet!")
        }

        res.status(200).json({
            status:"Success",
            msg:"Draft posts are listed here!",
            drafts:draftPosts
        })

    }catch(err){
        next(err)
    }
}

const archivePost = (req, res, next) =>{
    try{
        const {pId} = req.params;    
        const checkExistPost = getAllPosts().find(post => post.id === Number(pId))
    
        if(!checkExistPost){
            throw new customErrorHandler(404, `The post with ID ${pId} does not exist in the system.`)        
        }
        
        let userId = Number(req.user.id);
        const postId = Number(pId)
        
        const checkPostOwner = getAllPosts().find(post => post.id === Number(pId) && post.userId === userId )
        
        if(!checkPostOwner){
            throw new customErrorHandler(400, `You are not allowed to archive this post`)
        }

        const status = "archive"
        const statusChange = changePostStatus(postId, status)

        if(!statusChange){
            throw new customErrorHandler(400, "Something Went wrong. Post archive failed")
        }
        
        res.status(200).json({
            status:"Success",
            msg:`Post archived successfully with given Post Id: ${postId}`
        })

    } catch(err){
        next(err)
    }
}

const getArchivePost = (req, res, next) =>{
    try{

        let userId = Number(req.user.id);
        const status = "archive"
        
        const draftPosts = draftAndArchivePost(userId, status)
        
        if(!draftPosts.length){
            throw new customErrorHandler(400, "You don't have any archive yet!")
        }

        res.status(200).json({
            status:"Success",
            msg:"Archive posts are listed here!",
            drafts:draftPosts
        })

    }catch(err){
        next(err)
    }
}


const trendingPosts = (req, res, next) =>{
    try{

        const allPosts = getAllPosts();

        const postsWithEngagement = allPosts.map(post =>{
            return {
                ...post,
                engagementScore:postEngagement(Number(post.id))
            }
        })

        const trending = postsWithEngagement.sort((a, b)=>{
            if(a.engagementScore !== b.engagementScore){
                return b.engagementScore - a.engagementScore;
            }

            return new Date(b.postingDate) - new Date(a.postingDate);
        })

        res.status(200).json({
            status:"Success",
            msg:"Trending",
            post:trending
        })

    }catch(err){
        next(err)
    }
}

export {allPosts, 
        postById, 
        createPosts, 
        userAllPosts, 
        userUpdatePost,
        userDeletePost,
        getPostByCaption,
        bookmarkAdd,
        getBookmark,
        draftPost,
        getDraftPost,
        archivePost,
        getArchivePost,
        trendingPosts
    }











