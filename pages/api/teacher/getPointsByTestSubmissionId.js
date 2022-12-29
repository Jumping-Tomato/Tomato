import { getToken } from "next-auth/jwt"
import { testSubmissions } from "database/testSubmissions"


export default async function getPointsByTestSubmissionId(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if(!session || session.role != "teacher"){
        return res.status(403).json({ error: "forbidden" })
    }
    try {
        const { test_submission_id } = req.query;
        const point_data = await testSubmissions.getPointsByTestSubmissionId(test_submission_id);
        return res.status(200).json({"point_data": point_data});
    }
    catch(error){
        console.error(error);
        return res.status(500).send({"error": "unable to get points of the test submission."})
    }
}