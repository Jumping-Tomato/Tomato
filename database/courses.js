import dbPromise from "database/mongodb-config";

let db;
dbPromise.then((value) => {
    const client = value;
    db = client.db("Tomato");
})
.catch((error)=>{
    console.error(error);
});

export const courses = {
    createCourse,
    getCoursesForTeacher: async teacher_id => {
        return await db.collection("courses").find({"teacher_id": teacher_id})
        .project({ name: 1, semester: 1 }).toArray();
    },
    getCoursesForStudent: async user_id => {
        return await db.collection("users").find({"_id": user_id}).project({ courses: 1});
    },
    findCourses: findCourses   
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


async function findCourses(teacherFirstname, teacherLastname, course){
    try{
        let courses = await db.collection("courses").aggregate([
            {
              $lookup:{
                    from: "users",
                    localField: "teacher_id",
                    foreignField: "_id",
                    as: "teacher_info"
                }
            },
            {
              $match:{
                $and: [
                    {name: course},
                    {"teacher_info.firstName": teacherFirstname},
                    {"teacher_info.lastName": teacherLastname}
                ]
              }
            }
        ]).toArray();
        return courses;
    }
    catch(error) {
        console.error(error);
        throw error;
    };
}