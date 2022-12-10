import { getToken } from "next-auth/jwt"
import { testSubmissions } from "database/testSubmissions"


export default async function getTestQuestion(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if(!session || session.role != "student"){
        return res.status(403).json({ error: "forbidden" })
    }
    try {
        const { testSubmissionId } = req.query;
        const question = await testSubmissions.getUnansweredQuestion(testSubmissionId);
        return res.status(200).json({"question": question});
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}