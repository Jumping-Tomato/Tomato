import { getToken } from "next-auth/jwt"
import { courses } from "database/courses"


export default async function createCourse(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if(!session || session.role != "teacher"){
        return res.status(403).json({ error: "forbidden" })
    }
    const course_data = req.body;
    course_data["teacher_id"] = session._id;
    course_data["students"] = []
    try {
        await courses.createCourse(course_data);
        return res.status(200).send("success");
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}
  