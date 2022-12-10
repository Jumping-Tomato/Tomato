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


export const testSubmissions = {
    createTestSubmission,
    testIsSubmitted: testIsSubmitted
};

async function createTestSubmission(submissionData) {
    submissionData.dateCreated = new Date().toISOString();
    submissionData.dateUpdated = new Date().toISOString();
    try {
        const result = await db.collection("testSubmissions").insertOne(submissionData);
        return result
    }
    catch(error){
        console.error(error);
        throw `Unable to create a test submission.\n Error:"${error}"`;
    }
}

async function testIsSubmitted(test_id, student_id) {
    try{
        const submission = await db.collection("testSubmissions").findOne({
            $and: [
                { "test_id": ObjectId(test_id)},
                { "student_id": ObjectId(student_id)},
            ]
        });
        if (submission){
            return true;
        }
        return false;
    }
    catch(error){
        throw `Unable to find the Test submission.\nError: "${error}"`;
    }
}