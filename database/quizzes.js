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
    // generate new user id
    let quiz_id;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
  
    if(collectionNames.indexOf("quizzes") == -1){
        quiz_id = 1;
    }
    else{
        const latest_quiz = await db.collection("quizzes").find({}).sort({"_id":-1}).limit(1).toArray();
        quiz_id = latest_quiz[0]["_id"] + 1;
    }
    quizData._id = quiz_id;
    
    // set date created and updated
    quizData.dateCreated = new Date().toISOString();
    quizData.dateUpdated = new Date().toISOString();

    // add and save user
    db.collection("quizzes").insertOne(quizData).catch((error)=>{
        throw `Unable to create quiz with the email`;
    });
}