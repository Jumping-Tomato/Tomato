import { getToken } from "next-auth/jwt"
import { courses } from "database/courses"


export default async function getCoursesForTeacher(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if(!session || session.role != "teacher"){
        return res.status(403).json({ error: "forbidden" })
    }
    try {
        const course_list = await courses.getCoursesForTeacher(session._id);
        return res.status(200).json({"courses": course_list});
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}