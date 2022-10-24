import dbPromise from "database/mongodb-config";

let db;
let client;
dbPromise.then((value) => {
    client = value;
    db = client.db("Tomato");
})
.catch((error)=>{
    console.error(error);
});

export const courses = {
    approveStudent: approveStudent,
    createCourse,
    denyStudent: denyStudent,
    getCoursesForTeacher: async teacher_id => {
        return await db.collection("courses").find({"teacher_id": teacher_id})
        .project({ name: 1, semester: 1 }).toArray();
    },
    getCoursesForStudent: async user_id => {
        return await db.collection("users").find({"_id": user_id}).project({ courses: 1});
    },
    getCourseById: async course_id => {
        return await db.collection("courses").findOne({"_id": course_id});
    },
    getStudentsByCourseId: getStudentsByCourseId,
    findCourses: findCourses,
    requestToJoin:requestToJoin    
};

async function approveStudent(course_id, student_id){
    const num_course_id = Number(course_id);
    const num_student_id = Number(student_id);
    const session = client.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    const coursesCollection = client.db("Tomato").collection("courses");
    const usersCollection = client.db("Tomato").collection("users");
    try{
        const transactionResults = await session.withTransaction(async () => {
            await coursesCollection.updateOne(
                {"_id": num_course_id},
                {
                    $addToSet: { "students": num_student_id },
                    $pull: { "pending_students": num_student_id }
                },
                { session }
            );
            await usersCollection.updateOne(
                {"_id": num_student_id},
                {
                    $addToSet: { "courses": num_course_id },
                },
                { session }
            );
            const updatedCourse = await coursesCollection.findOne(
                { "_id": num_course_id, students: { $in: [num_student_id] } },
                { session });
            const updatedUser = await usersCollection.findOne(
                { "_id": num_student_id, courses: { $in: [num_course_id] } },
                { session });
            if(!updatedCourse || !updatedUser){
                await session.abortTransaction();
                return;
            }
        }, transactionOptions);
        if (transactionResults) {
            console.log("The student is approved.");
        } else {
            const error = "An error has occur while trying to approve a student.";
            console.error(error);
            throw error;
        }
    }
    catch(error){
        console.error(error);
        throw error;
    }
    finally {
        await session.endSession();
    }
}

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

async function denyStudent(course_id, student_id){
    try{
        const num_course_id = Number(course_id);
        const num_student_id = Number(student_id);
        const result = await db.collection("courses").updateOne(
            {"_id": num_course_id},
            {
                $pull: { "pending_students": num_student_id }
            }
        );
        return result;
    }
    catch(error){
        console.error(error);
        throw error;
    }
}

async function findCourses(teacherFirstname, teacherLastname, course, student_id){
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
                    {name: {$regex :`.*${course}.*`, $options: "i"}},
                    {"teacher_info.firstName": {$regex :`.*${teacherFirstname}.*`, $options: "i"}},
                    {"teacher_info.lastName": {$regex :`.*${teacherLastname}.*`, $options: "i"}}
                ]
              }
            },
            {
                $addFields: {
                  joined: {
                    $and: [
                        {"$eq": [
                            {
                              $type: "$students"
                            },
                            "array"
                        ]},
                        {$in: [student_id, "$students"]}
                    ]
                   },
                   pending: {
                    $and: [
                        {"$eq": [
                            {
                              $type: "$pending_students"
                            },
                            "array"
                        ]},
                        {$in: [student_id, "$pending_students"]}
                    ]    
                   }
                }
            },
            {   
                $project: { 
                name : 1, 
                semester: 1,
                joined: 1,
                pending: 1, 
                "teacher_info.firstName": 1, 
                "teacher_info.lastName": 1  
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

async function getStudentsByCourseId(course_id){
    const course_document = await db.collection("courses").findOne({"_id": course_id});
    const pending_student_ids = course_document.pending_students ? course_document.pending_students : [];
    const student_ids = course_document.students ? course_document.students : [];
    const students = await db.collection("users").find(
            {"_id":{$in: student_ids}},
            {projection: {firstName:1, lastName:1}}
        ).toArray();
    const pending_students = await db.collection("users").find(
            {"_id": {$in: pending_student_ids}},
            {projection: {firstName:1, lastName:1}}
        ).toArray();
    const result = {
        "students":{
            "pending_students":pending_students,
            "students": students
        }
    }
    return result;
}

async function requestToJoin(studentId, courseId){
    try{
        const course_id = Number(courseId);
        const result = await db.collection("courses").updateOne(
            {"_id": course_id},
            {$addToSet: { "pending_students": studentId }}
        );
        return result;
    }
    catch(error){
        console.error(error);
        throw error;
    }
}

