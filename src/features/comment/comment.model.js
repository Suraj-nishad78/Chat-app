let comments = []
let id = 1;


const allCommnets = () =>{
    return comments;
}

const commentsById = (id) =>{
    const comment = allCommnets().filter(comment=>comment.postId === id)
    return comment;
}

const postComment = (cmt) =>{
    const comment = {id, ...cmt}
    allCommnets().push(comment)
    id++;
    return comment;
}

const updateComment = (id, cmt) =>{
    const commentIndex = comments.findIndex(comment=>comment.id === id)

    if(commentIndex === -1){
        return null;
    }

    comments[commentIndex] = {...comments[commentIndex], ...cmt}

    return comments[commentIndex];
}

const deleteComment = (id) =>{
    const deletedComment = allCommnets().find(comment=> comment.id === id)
    comments = comments.filter(comment=>comment.id !== id)

    return deletedComment;
}


export {allCommnets, 
        commentsById,
        postComment,
        updateComment,
        deleteComment
       }


