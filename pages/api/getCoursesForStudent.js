import { getToken } from "next-auth/jwt"
import { courses } from "database/courses"


export default async function getCoursesForStudent(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if(!session || session.role != "student"){
        return res.status(403).json({ error: "forbidden" })
    }
    try {
        const course_list = await courses.getCoursesForStudent(session._id);
        return res.status(200).json({"courses": course_list});
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}