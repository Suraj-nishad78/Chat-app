let users = []
let id = 1;

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

const getAllUsers = () =>{
    return users
}

export {createUsers, findUsers, getAllUsers}