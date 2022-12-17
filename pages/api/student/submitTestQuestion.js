import { getToken } from "next-auth/jwt"
import { testSubmissions } from "database/testSubmissions"


export default async function submitTestQuestion(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if(!session || session.role != "student"){
        return res.status(403).json({ error: "forbidden" })
    }
    try {
        const { test_submission_id, question_data } = req.body;
        const result = await testSubmissions.submitTestQuestionById(test_submission_id, question_data);
        return res.status(200).send("success");
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}