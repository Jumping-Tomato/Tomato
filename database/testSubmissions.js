import { getClient, getDB } from "database/mongodb-config";
const { ObjectId } = require('mongodb')
var isEqual = require('lodash.isequal');


export const testSubmissions = {
    createTestSubmission,
    testIsSubmitted: testIsSubmitted,
    getUnansweredQuestion: getUnansweredQuestion,
    someoneHasSubmitted: someoneHasSubmitted,
    submitTestQuestionById: submitTestQuestionById,
    setTotalScoreById: setTotalScoreById,
    getAllTestScores: getAllTestScores,
    getPointsByTestSubmissionId: getPointsByTestSubmissionId,
    getActivitiesByTestSubmissionId: getActivitiesByTestSubmissionId,
    getTestSubmissionById: getTestSubmissionById
};

async function createTestSubmission(submissionData) {
    const db = await getDB();
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
        const db = await getDB();
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
        const db = await getDB();
        const submission = await db.collection("testSubmissions").findOne({
            "_id": ObjectId(testSubmission_id)
        });
        let questions = [];
        if(submission){
            questions = submission.unanswered_questions;
        }
        if(questions.length){
            let questionObject = questions[0];
            //take out the correct_answers from the students
            delete questionObject.detail.correct_answers;
            return questionObject;
        }
        return null;
    }
    catch(error){
        throw `Unable to get a question.\nError: "${error}"`;
    }
}
async function someoneHasSubmitted(test_id){
    try {
        const db = await getDB();
        const submission = await db.collection("testSubmissions").findOne(
           { "test_id": ObjectId(test_id)},
        );
        if(submission){
            return true;
        }
        return false;
    }
    catch(error){
        throw error;
    }
}

async function submitTestQuestionById(test_submission_id, question_data){
    let client = await getClient();
    const session = client.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    try{
        const testSubmissionsCollection = client.db("Tomato").collection("testSubmissions");
        const transactionResults = await session.withTransaction(async () => {
            const testSubmissions = await testSubmissionsCollection.findOne(
                {"_id": ObjectId(test_submission_id)},
                { session }
            );
            const correct_answers = testSubmissions.unanswered_questions[0].detail.correct_answers
            question_data = getGradedQuestion(question_data,correct_answers)
            
            const submit_answered_question = await testSubmissionsCollection.updateOne(
                {"_id": ObjectId(test_submission_id)},
                {$push: {answered_questions: question_data}},
                { session }
            );
            console.log(`${submit_answered_question.matchedCount} document(s) found in the testSubmissions collection with the _id ${test_submission_id}.`);
            console.log(`${submit_answered_question.modifiedCount} document(s) was/were updated to append a new question to answered_questions array. question_id:  ${question_data.id}.`);
            
            const removed_unanswered_question = await testSubmissionsCollection.updateOne(
                {"_id": ObjectId(test_submission_id)},
                {$pop: {unanswered_questions: -1}},
                { session }
            );
            console.log(`${removed_unanswered_question.matchedCount} document(s) found in the testSubmissions collection with the _id ${test_submission_id}.`);
            console.log(`${removed_unanswered_question.modifiedCount} document(s) was/were updated to remove the first question question from unanswered_questions array. question_id:  ${question_data.id}.`);
            
            const date = new Date().toISOString();
            const updated_date = await testSubmissionsCollection.updateOne(
                {"_id": ObjectId(test_submission_id)},
                {$set: {dateUpdated: date}},
                { session }
            );
            console.log(`${updated_date.matchedCount} document(s) found in the testSubmissions collection with the _id ${test_submission_id}.`);
            console.log(`${updated_date.modifiedCount} document(s) was/were updated to update dateUpdated field with _id  ${test_submission_id.id}. Date: ${date}`);
            
            const updatedTestSubmission = await testSubmissionsCollection.findOne(
                {"_id": ObjectId(test_submission_id)},
                { session }
            );
            
            const answered_questions = updatedTestSubmission.answered_questions;
            if(!answered_questions || !answered_questions.length){
                console.error(`No new question added to answered_questions array.\nTest Submission Id: "${test_submission_id}"`)
                await session.abortTransaction();
                return;
            }
            
            const new_answer = answered_questions[answered_questions.length - 1]
            if (!isEqual(new_answer,question_data)){
                console.error(`The answered question was NOT added to answered_questions array.\nTest Submission Id: "${test_submission_id}"`)
                await session.abortTransaction();
                return;
            }
            
            const unanswered_questions = updatedTestSubmission.unanswered_questions;
            if(unanswered_questions && unanswered_questions.length ){
                const first_unanswered_question = unanswered_questions[0];
                delete question_data['answers'];
                delete question_data['score'];
                if(isEqual(first_unanswered_question,question_data)){
                    console.error(`The answered question was NOT removed from unanswered_questions array.\nTest Submission Id: "${test_submission_id}"`)
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
        console.error(`Test Submission ID: "${id}"`)
        throw `Unable to submit the test question.\nError: "${error}"`;
    }
    finally {
        await session.endSession();
    }
}

function getGradedQuestion(questionData, correct_answers){  
    let score = 0;
    if(questionData.type == "multipleChoice"){
        questionData.answers.forEach((each)=>{
            if(correct_answers[each]){
                let point = correct_answers[each]["point"];
                score += point;
            }
        });
    }
    else{
        questionData.answers.forEach((each)=>{
            for(let i=0; i < correct_answers.length; i++){
                let right_answer = correct_answers[i];
                if(each == right_answer.answer){
                    let point = right_answer.point;
                    score += point;
                }
            }
        });
    }
    questionData.correct_answers = correct_answers;
    questionData.score = score;
    return questionData;
}


async function setTotalScoreById(test_submission_id){
    try{
        const db = await getDB();
        const testSubmissions = await db.collection("testSubmissions").findOne(
            {"_id": ObjectId(test_submission_id)}
        );
        if(!testSubmissions){
            return false;
        }
        const answered_questions = testSubmissions.answered_questions;
        let total_score = 0;
        answered_questions.forEach((each)=>{
            total_score += each.score;
        })
        const result = await db.collection("testSubmissions").updateOne(
            {"_id": ObjectId(test_submission_id)},
            {$set: {total_score: total_score}},
        );
        if(!result){
            return false;
        }
        return true;
    }
    catch(error){
        throw `Unable to calculate the total score of the test submission.\nError: "${error}"\ntest_submission_id: "${test_submission_id}"`;
    }
}

async function getAllTestScores(test_id){
    try{
        const db = await getDB();
        const submissions = await db.collection("testSubmissions").aggregate([
            {
                $match: {
                    test_id: ObjectId(test_id)
                } 
            },
            {
                $lookup:{
                    from: "users",
                    localField: "student_id",
                    foreignField: "_id",
                    as: "student"
                }
            },
            {
                $project:{
                    _id : 1,
                    dateUpdated: 1,
                    "student.firstName" : 1,
                    "student.lastName" : 1,
                    total_score: 1
                }
            }
        ]).toArray();
        return submissions
    }
    catch(error){
        throw `Unable to get all scores of test.\n test_id: "${test_id}".\nError: "${error}"`;
    }
}

async function getPointsByTestSubmissionId(test_submission_id){
    try{
        const db = await getDB();
        const testSubmissions = await db.collection("testSubmissions").findOne(
            {"_id": ObjectId(test_submission_id)}
        );
        let point_data = [];
        testSubmissions.answered_questions.forEach((each)=>{
            let data = {
                "type": each.type,
                "question": each.detail.question,
                "answers": each.answers,
                "score": each.score,
                "correct_answers": each.correct_answers
            }
            if(each.type == "multipleChoice"){
                data["choices"] = each.detail.choices
            }
            point_data.push(data);
        });
        return point_data;
    }
    catch(error){
        throw error;
    }
}

async function getActivitiesByTestSubmissionId(test_submission_id){
    try{
        const db = await getDB();
        const testSubmissions = await db.collection("testSubmissions").findOne(
            {"_id": ObjectId(test_submission_id)}
        );
        let activity_data = [];
        testSubmissions.answered_questions.forEach((each)=>{
            let data = {
                "question": each.detail.question,
                activities: []
            }
            const activities = each.activities;
            activities.forEach((activity)=>{
                data.activities.push(activity);
            });
            activity_data.push(data);
        });
        return activity_data;
    }
    catch(error){
        throw error;
    }
}

async function getTestSubmissionById(test_submission_id){
    try{
        const db = await getDB();
        const submissionData = await db.collection("testSubmissions").findOne(
            {"_id": ObjectId(test_submission_id)}
        );
        return submissionData;
    }
    catch(error){
        throw error;
    }
}