import { getToken } from "next-auth/jwt";
import { testSubmissions } from "database/testSubmissions";


export default async function getAllTestScores(req, res) {
    const session = await getToken({ req})
    if(!session || session.role != "teacher"){
        return res.status(403).json({ error: "forbidden" })
    }
    const { test_id } = req.query;
    try {
        const score_data = await testSubmissions.getAllTestScores(test_id);
        return res.status(200).json({score_data: score_data});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({"error": error.message});
    }
}