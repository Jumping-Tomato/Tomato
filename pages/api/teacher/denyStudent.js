import { getToken } from "next-auth/jwt"
import { courses } from "database/courses"


export default async function denyStudent(req, res) {
    const session = await getToken({ req})
    if(!session || session.role != "teacher"){
        return res.status(403).json({ error: "forbidden" })
    }
    const {course_id, student_id} = req.body;
    try {
        await courses.denyStudent(course_id, student_id);
        return res.status(200).send("success");
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}