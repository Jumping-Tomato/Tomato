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
    createTest,
    deleteTestById: async test_id =>{
        try{
            const result = await db.collection("tests").deleteOne({"_id": ObjectId(test_id) });
            return result
        }
        catch(error){
            throw `Unable to delete the Test.\nError: "${error}"`;
        }
    },
    editTestDetail: editTestDetail,
    getTestsByCourseId: async course_id => {
        return await db.collection("tests").find({"course_id": ObjectId(course_id)})
        .project({ name: 1, shuffle:1, startDate:1, deadline:1 }).toArray();
    },
    getTestById: async test_id => {
        return await db.collection("tests").findOne({"_id": ObjectId(test_id)});
    },
    updateQuestions: updateQuestions,
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

async function editTestDetail(test_id, changed_data){
    try{
        const result = await db.collection("tests")
                        .updateOne(
                            {"_id": ObjectId(test_id)},
                            {$set: {
                                "name": changed_data.name,
                                "shuffle": changed_data.shuffle,
                                "startDate": changed_data.startDate,
                                "deadline": changed_data.deadline,
                                "dateUpdated": new Date().toISOString() 
                            }}
                        );
        return result;
        
    }
    catch(error){
        throw error;
    }
}

async function updateQuestions(test_id, questions_data){
    try{
        const dateUpdated = new Date().toISOString();
        let questions = [];
        questions_data.forEach((item)=>{
            const id = item.id;
            const type = item.type;
            const question = item[type];
            const question_obj = {
                id: id,
                type: type,
                detail:question
            }
            questions.push(question_obj);
        });
        const result = await db.collection("tests").updateOne(
                                                        {"_id": ObjectId(test_id)},
                                                        {$set: {
                                                            "questions": questions,
                                                            "dateUpdated": dateUpdated
                                                        }},
                                                        {upsert: true}
                                                    );
        return result;
    }
    catch(error){
        console.error(error);
        throw `Unable to update question of test "${test_id}". Error: "${error}"`;
    }
}