import { getToken } from "next-auth/jwt";
import { testSubmissions } from "database/testSubmissions";


export default async function setTestTotalScore(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if(!session || session.role != "student"){
        return res.status(403).json({ error: "forbidden" })
    }
    try {
        const { test_submission_id } = req.body;
        const result = await testSubmissions.setTotalScoreById(test_submission_id);
        if(result){
            return res.status(200).send("success");
        }
        return res.status(500).json({error: "unable to calculate the total score."})    
    }
    catch(error){
        return res.status(500).json({"error": error});
    }
}