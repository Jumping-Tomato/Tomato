import { getToken } from "next-auth/jwt"
import { courses } from "database/courses"


export default async function approveStudent(req, res) {
    const session = await getToken({ req})
    if(!session || session.role != "teacher"){
        return res.status(403).json({ error: "forbidden" })
    }
    const {course_id, student_id} = req.body;
    try {
        const approved = await courses.approveStudent(course_id, student_id);
        if(approved){
            return res.status(200).send("success");
        }
        return res.status(500).send("failure");
        
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}