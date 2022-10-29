import dbPromise from "database/mongodb-config";
const { ObjectId } = require('mongodb')

let db;
dbPromise.then((value) => {
    const client = value;
    db = client.db("Tomato");
})
.catch((error)=>{
    console.error(error);
});


export const tests = {
    createTest    
};

async function createTest(testData) {
    // set date created and updated
    testData.dateCreated = new Date().toISOString();
    testData.dateUpdated = new Date().toISOString();

    // add and save user
    db.collection("tests").insertOne(testData).catch((error)=>{
        throw `Unable to create quiz with the email`;
    });
}