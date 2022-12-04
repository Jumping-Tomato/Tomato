import { getToken } from "next-auth/jwt"
import { courses } from "database/courses"


export default async function requestToJoin(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if(!session || session.role != "student"){
        return res.status(403).json({ error: "forbidden" })
    }
    try {
        const { course_id } = req.body;
        await courses.requestToJoin(session._id, course_id);
        return res.status(200).send("success");
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}