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
        const test_id = req_data["_id"];

        const test = await tests.getTestById(test_id);
        if(new Date() >= new Date(test.startDate)){
            return res.status(403).send({"error": "you can NOT update test detail anymore after the start date."});
        }
 
        const { startDate, deadline } = req_data;
        if(new Date(startDate) >= new Date(deadline)){
            return res.status(406).send({"error": "Start date must be earlier than the deadline."});
        }

        const changed_data = {
            name: req_data.name,
            shuffle: req_data.shuffle,
            startDate: req_data.startDate,
            deadline: req_data.deadline,
        }
        await tests.editTestDetail(test_id, changed_data);      
        return res.status(200).send("success");
    }
    catch(error){
        console.error(error);
        return res.status(500).send({"error": "unable to edit test detail"})
    }
}
  