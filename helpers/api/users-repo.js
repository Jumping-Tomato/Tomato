import clientPromise from "database/mongodb";

let users;
clientPromise.then((value) => {
    const client = value;
    const db = client.db("Tomato");
    users = db.collection("users")
});


export const usersRepo = {
    getAll: async () => {
        return await users.find({}).toArray();
    },
    getById: async id => {
        return await users.findOne({"id": id});
    },
    find: async username => {
        return await users.findOne({"username": username});
    } ,
    create,
    update,
    // delete: _delete
};

function create(user) {
    // generate new user id
    user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;

    // set date created and updated
    user.dateCreated = new Date().toISOString();
    user.dateUpdated = new Date().toISOString();

    // add and save user
    users.insertOne(user).catch((error)=>{
        throw `Unable to create user with the username "${user.username}"`;
    });
}

function update(id, params) {
    delete params['_id'];
    return users.replaceOne({"id":id},params)
    .then((result)=>{
        console.log(`user with id "${id}" is updated is mongoDB`);
        console.log(result);
    })
    .catch((error)=>{
        throw `Unable to update user with the username.\nError: "${error}"`;
    });
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id) {
    // filter out deleted user and save
    users = users.filter(x => x.id.toString() !== id.toString());
    saveData();
    
}
