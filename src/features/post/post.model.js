let posts = []
let id = 1;

const getAllPosts = () =>{
    return posts;
}

const userPosts = (uId) =>{
    const posts = getAllPosts().filter(post => post.userId === uId)
    return posts;
}

const getPostById = (id) =>{
    const post  = getAllPosts().find(post => post.id === id)
    return post;
}

const createPost = (post) =>{
    const newPost = {id, ...post}
    getAllPosts().push(newPost)
    id++;
    return newPost
}

const updatePost = (id, post) =>{
    const postIndex = getAllPosts().findIndex(post=>post.id === id)
    if(postIndex === -1){
        return null
    }

    posts[postIndex] = {...posts[postIndex], ...post}

    return posts[postIndex];
}

const deletePost = (id) =>{
    const delPost = posts.find(post=>post.id === id)

    posts = posts.filter(post => post.id !== id)

    return delPost;
}


export {getAllPosts, 
        getPostById, 
        createPost, 
        userPosts, 
        updatePost, 
        deletePost
     }