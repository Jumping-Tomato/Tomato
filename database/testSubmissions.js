import dbPromise from "database/mongodb-config";
const { ObjectId } = require('mongodb')

let db;
let client;
dbPromise.then((value) => {
    client = value;
    db = client.db("Tomato");
})
.catch((error)=>{
    console.error(error);
});


export const testSubmissions = {
    createTestSubmission,
    testIsSubmitted: testIsSubmitted,
    getUnansweredQuestion: getUnansweredQuestion,
    submitTestQuestionById: submitTestQuestionById
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

async function getUnansweredQuestion(testSubmission_id){
    try{
        const submission = await db.collection("testSubmissions").findOne({
            "_id": ObjectId(testSubmission_id)
        });
        let questions = [];
        if(submission){
            questions = submission.unanswered_questions;
        }
        if(questions.length){
            return questions[0];
        }
        return null;
    }
    catch(error){
        throw `Unable to get a question.\nError: "${error}"`;
    }
}

async function submitTestQuestionById(test_submission_id, question_data){
    try{
        const session = client.startSession();
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };
        const testSubmissionsCollection = client.db("Tomato").collection("testSubmissions");
        const transactionResults = await session.withTransaction(async () => {
            const submit_answered_question = await testSubmissionsCollection.updateOne(
                {"_id": ObjectId(test_submission_id)},
                {$push: {answered_questions: question_data}}
            );
            console.log(`${submit_answered_question.matchedCount} document(s) found in the testSubmissions collection with the _id ${test_submission_id}.`);
            console.log(`${submit_answered_question.modifiedCount} document(s) was/were updated to include the reservation.`);
            const removed_unanswered_question = await testSubmissionsCollection.updateOne(
                {"_id": ObjectId(test_submission_id)},
                {$pop: {unanswered_questions: 1}}
            );
            console.log(`${removed_unanswered_question.matchedCount} document(s) found in the testSubmissions collection with the _id ${test_submission_id}.`);
            console.log(`${removed_unanswered_question.modifiedCount} document(s) was/were updated to include the reservation.`);
            const updatedTestSubmission = await testSubmissionsCollection.findOne(
                {"_id": ObjectId(test_submission_id)}
            );
            const answered_questions = updatedTestSubmission.answered_questions;
            if(!answered_questions || !answered_questions.length){
                await session.abortTransaction();
                return;
            }
            const new_answer = answered_questions[answered_questions.length - 1]
            if (!_.isEqual(new_answer,question_data)){
                await session.abortTransaction();
                return;
            }
            const unanswered_questions = updatedTestSubmission.unanswered_questions;
            if(unanswered_questions && unanswered_questions.length ){
                const first_unanswered_question = unanswered_questions[0];
                if(_.isEqual(first_unanswered_question,question_data)){
                    await session.abortTransaction();
                    return;
                }
            }
        }, transactionOptions);
        if (!transactionResults) {
            throw Error("An error has occured while a test taker is trying to submit a question.");
        }
        return transactionResults;
    }
    catch(error){
        console.error(`Unable to submit the test question.\nError: "${error}"`);
        console.error(`Submission: "${id}"`)
        throw `Unable to submit the test question.\nError: "${error}"`;
    }
}