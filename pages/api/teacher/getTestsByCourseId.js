import { getToken } from "next-auth/jwt"
import { tests } from "database/tests"

export default async function getTestsByCourseId(req, res) {
    const session = await getToken({ req })
    if(!session || session.role != "teacher"){
        return res.status(403).json({ error: "forbidden" })
    }
    let {course_id} = req.query;
    try {
        const test_array = await tests.getTestsByCourseId(course_id);
        return res.status(200).json({"tests": test_array});
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}