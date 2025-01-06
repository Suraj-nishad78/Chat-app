
import {customErrorHandler} from "../../middleware/errorHandler.middleware.js"

let users = []
let id = 1;

const getAllUsers = () =>{
    return users
}

const createUsers = (user) =>{
    const { name, email, password} = user;
    const newUser = { id, name, email, password}
    getAllUsers().push(newUser)
    id++;
    return newUser;
}

const findUsers = (email) =>{
    const findUser = getAllUsers().find(user=>user.email == email)
    return findUser;
}

const addBookmarkInUser = (userId, postId) =>{
    const findUserIndex = getAllUsers().findIndex(user => user.id === userId)
        
    if (findUserIndex === -1){
        throw new customErrorHandler(404, "User not found")
    }

    const user = users[findUserIndex];

    if(!user.bookmark){
        user.bookmark = []
    }

    user.bookmark.push({postId})

    return true;
}


export {createUsers, findUsers, getAllUsers, addBookmarkInUser}