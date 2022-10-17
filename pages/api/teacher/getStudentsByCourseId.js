import { getToken } from "next-auth/jwt"
import { courses } from "database/courses"

export default async function getStudentsByCourseId(req, res) {
    const session = await getToken({ req })
    if(!session || session.role != "teacher"){
        return res.status(403).json({ error: "forbidden" })
    }
    let {course_id} = req.query; 
    course_id = Number(course_id);
    try {
        const students= await courses.getStudentsByCourseId(course_id);
        return res.status(200).json(students);
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}