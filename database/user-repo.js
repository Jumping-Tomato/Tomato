import dbPromise from "database/mongodb-config";

let db;
dbPromise.then((value) => {
    const client = value;
    db = client.db("Tomato");
})
.catch((error)=>{
    console.error(error);
});


export const usersRepo = {
    getAll: async () => {
        return await db.collection("users").find({}).toArray();
    },
    getById: async id => {
        return await db.collection("users").findOne({"id": id});
    },
    find: async email => {
        return await db.collection("users").findOne({"email": email});
    } ,
    create,
    update,
    delete: _delete
};

async function create(user) {
    // generate new user id
    let uid;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
  
    if(collectionNames.indexOf("users") == -1){
        uid = 1;
    }
    else{
        const newest_user = await db.collection("users").find({}).sort({"id":-1}).limit(1).toArray();
        uid = newest_user[0]["id"] + 1;
    }
    user.id = uid;
    
    // set date created and updated
    user.dateCreated = new Date().toISOString();
    user.dateUpdated = new Date().toISOString();

    // add and save user
    db.collection("users").insertOne(user).catch((error)=>{
        throw `Unable to create user with the email "${user.email}"`;
    });
}

function update(id, params) {
    delete params['_id'];
    return db.collection("users").replaceOne({"id":id},params)
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
        let result = await db.collection("users").deleteOne({"id": id });
        return result
    }
    catch(error){
        throw `Unable to delete the user.\nError: "${error}"`;
    }
}
