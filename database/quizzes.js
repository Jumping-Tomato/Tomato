import dbPromise from "database/mongodb-config";

let db;
dbPromise.then((value) => {
    const client = value;
    db = client.db("Tomato");
})
.catch((error)=>{
    console.error(error);
});


export const quizzes = {
    createNewQuiz,    
};

async function createNewQuiz(quizData) {
    // set date created and updated
    quizData.dateCreated = new Date().toISOString();
    quizData.dateUpdated = new Date().toISOString();

    // add and save user
    db.collection("quizzes").insertOne(quizData).catch((error)=>{
        throw `Unable to create quiz with the email`;
    });
}