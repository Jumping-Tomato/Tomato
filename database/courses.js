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

export const courses = {
    approveStudent: approveStudent,
    createCourse,
    denyStudent: denyStudent,
    getCoursesForTeacher: async teacher_id => {
        return await db.collection("courses").find({"teacher_id": ObjectId(teacher_id)})
        .project({ name: 1, semester: 1 }).toArray();
    },
    getCoursesForStudent: async user_id => {
        const student = await db.collection("users").findOne({"_id": ObjectId(user_id)});
        const courses = await db.collection("courses").find({"_id" : { $in: student.courses }}).project({ name:1, semester:1}).toArray();
        return courses;
    },
    getCourseById: async course_id => {
        return await db.collection("courses").findOne({"_id": ObjectId(course_id)});
    },
    getStudentsByCourseId: getStudentsByCourseId,
    findCourses: findCourses,
    requestToJoin:requestToJoin,
    isStudentInCourse: isStudentInCourse
};

async function approveStudent(course_id, student_id){
    course_id = ObjectId(course_id);
    student_id = ObjectId(student_id);
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
                {"_id": course_id},
                {
                    $addToSet: { "students": student_id },
                    $pull: { "pending_students": student_id }
                },
                { session }
            );
            await usersCollection.updateOne(
                {"_id": student_id},
                {
                    $addToSet: { "courses": course_id },
                },
                { session }
            );
            const updatedCourse = await coursesCollection.findOne(
                {
                    $and: [
                        {"_id": course_id, students: { $in: [student_id] }}
                    ]
                },
                { session }
            );
            const updatedUser = await usersCollection.findOne(
                {
                    $and: [
                        { "_id": student_id, courses: { $in: [course_id] } },
                    ]
                },
                { session }
            );
            if(!updatedCourse || !updatedUser){
                await session.abortTransaction();
                return;
            }
        }, transactionOptions);
        if (!transactionResults) {
            throw Error("An error has occur while trying to approve a student.");
        }
        return true;
    }
    catch(error){
        console.error(error);
        return false;
    }
    finally {
        await session.endSession();
    }
}

async function createCourse(courseData) { 
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
        const result = await db.collection("courses").updateOne(
            {"_id": ObjectId(course_id)},
            {
                $pull: { "pending_students": ObjectId(student_id) }
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
    student_id = ObjectId(student_id)
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
    const course_document = await db.collection("courses").findOne({"_id": ObjectId(course_id)});
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
        studentId = ObjectId(studentId);
        courseId = ObjectId(courseId);
        const result = await db.collection("courses").updateOne(
            {"_id": courseId},
            {$addToSet: { "pending_students": studentId }}
        );
        return result;
    }
    catch(error){
        console.error(error);
        throw error;
    }
}

async function isStudentInCourse(course_id, student_id){
    try{
        const course = await db.collection("courses").findOne({
            $and: [
                { "_id": ObjectId(course_id)},
                { "students": {$in: [ObjectId(student_id)]}},
            ]
        });
        if (course){
            return true;
        }
        return false;
    }
    catch(error){
        console.error(error);
        throw error;
    }
}
