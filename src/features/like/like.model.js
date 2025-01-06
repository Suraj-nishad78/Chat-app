let likes = []
let id = 1;

const allLikes = () =>{
    return likes
}

const likeById = (postId) =>{
    const likedPost = allLikes().filter(like=> like.postId === postId)
    return likedPost;
}

const toggleLikePost = (userId, postId) =>{
    const newLike = {id, userId, postId}
    const likedExist = allLikes().find( like => like.postId === postId && like.userId === userId)

    if(likedExist){
        likes = likes.filter(like => !(like.postId === postId && like.userId === userId));
        return false;
    } else {
        likes.push(newLike)
        id++;
        return newLike;
    }
}

export {allLikes, likeById, toggleLikePost}