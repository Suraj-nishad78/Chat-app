import express from "express"

const router = express.Router()

//Imports all function here
import{ allPosts, 
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
      } from "./post.controller.js"
 
import { upload } from "../../middleware/multer.js"

//Bookmarks Routes
router.get("/bookmarks", getBookmark)
router.get("/bookmark/:pId", bookmarkAdd)

//Draft Routes
router.get("/drafts", getDraftPost)
router.get("/draft/:pId", draftPost)

//Archive Routes
router.get("/archive", getArchivePost)
router.get("/archive/:pId", archivePost)

//Trending Routes
router.get("/trending", trendingPosts)


//Post Routes
router.get("/all", allPosts)
router.get("/", userAllPosts)
router.get("/:id", postById)
router.post("/", upload.single('imageUrl'), createPosts)
router.put("/:id", upload.single('imageUrl'), userUpdatePost)
router.delete("/:id", userDeletePost)

//Caption Routes
router.get("/caption/:caption", getPostByCaption)


export default router










