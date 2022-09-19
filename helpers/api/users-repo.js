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
    find: async email => {
        return await users.findOne({"email": email});
    } ,
    create,
    update,
    delete: _delete
};

async function create(user) {
    // generate new user id
    const newest_user = await users.find({}).sort({"id":-1}).limit(1).toArray();
    const max_id = newest_user[0]["id"];
    console.log(max_id)
    console.log(await users.count({}))
    
    user.id = users.count({}) ?  max_id + 1 : 1;
    // set date created and updated
    user.dateCreated = new Date().toISOString();
    user.dateUpdated = new Date().toISOString();

    // add and save user
    users.insertOne(user).catch((error)=>{
        throw `Unable to create user with the email "${user.email}"`;
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
        throw `Unable to update the user.\nError: "${error}"`;
    });
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id) {
    try{
        let result = await users.deleteOne({"id": id });
        return result
    }
    catch(error){
        throw `Unable to delete the user.\nError: "${error}"`;
    }
}
