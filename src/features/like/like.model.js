let likes = []
let id = 1;

const allLikes = () =>{
    return likes
}

const likeById = (id) =>{
    const likedPost = allLikes().filter(like=> like.postId === id)
    return likedPost;
}