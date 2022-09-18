import clientPromise from "database/mongodb";

let users;
clientPromise.then((value) => {
    const client = value;
    const db = client.db("Tomato");
    users = db.collection("users")
});


export const usersRepo = {
    // getAll: () => users.find(),
    // getById: id => users.find({"id": id}),
    find: async username => {
        const match_users = await users.findOne({"username": username});
        return match_users;
    } ,
    create,
    // update,
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
    const user = users.find(x => x.id.toString() === id.toString());

    // set date updated
    user.dateUpdated = new Date().toISOString();

    // update and save
    Object.assign(user, params);
    saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id) {
    // filter out deleted user and save
    users = users.filter(x => x.id.toString() !== id.toString());
    saveData();
    
}

// private helper functions

function saveData() {
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 4));
}