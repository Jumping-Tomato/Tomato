import { getToken } from "next-auth/jwt"
import { tests } from "database/tests"


export default async function getTests(req, res) {
    const session = await getToken({ req})
    if(!session || session.role != "student"){
        return res.status(403).json({ error: "forbidden" })
    }
    const {course_id } = req.query;
    try {
        const test_list = await tests.getTestsByCourseId(course_id);
        return res.status(200).json({"tests": test_list});
        
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}