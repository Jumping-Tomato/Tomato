import dbPromise from "database/mongodb-config";

let db;
dbPromise.then((value) => {
    const client = value;
    db = client.db("Tomato");
})
.catch((error)=>{
    console.error(error);
});

export const course = {
    createCourse,    
};

async function createCourse(courseData) {
    // generate new user id
    let course_id;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
  
    if(collectionNames.indexOf("courses") == -1){
        course_id = 1;
    }
    else{
        const latest_course = await db.collection("courses").find({}).sort({"_id":-1}).limit(1).toArray();
        course_id = latest_course[0]["_id"] + 1;
    }
    courseData._id = course_id;
    
    // set date created and updated
    courseData.dateCreated = new Date().toISOString();
    courseData.dateUpdated = new Date().toISOString();

    // add and save user
    db.collection("courses").insertOne(courseData).catch((error)=>{
        throw `Unable to create course`;
    });
}