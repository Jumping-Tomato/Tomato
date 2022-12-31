import { getToken } from "next-auth/jwt"
import { tests } from "database/tests"
const { ObjectId } = require('mongodb')
import { testSubmissions } from "database/testSubmissions"

export default async function editTestDetail(req, res) {
    try{
        const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
        if(session.role != "teacher"){
            res.status(403).json({ error: "forbidden" })
        }
        const req_data = req.body;
        if(testSubmissions.someoneHasSubmitted(req_data["_id"])){
            return res.status(403).json({ error: "A student has started the test" })
        }
        const { startDate, deadline } = req_data;
        if(new Date(startDate) >= new Date(deadline)){
            return res.status(406).send({"error": "Start date must be earlier than the deadline."});
        }
        
        const test_id = req_data["_id"];
        const changed_data = {
            name: req_data.name,
            startDate: req_data.startDate,
            deadline: req_data.deadline,
        }
    
        await tests.updateTestDetail(test_id, changed_data);
        res.status(200).send("success");
    }
    catch(error){
        console.error(error);
        res.status(500).send({"error": "unable to edit test detail"})
    }
}
  