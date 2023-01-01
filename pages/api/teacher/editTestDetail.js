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

        const someoneHasSubmitted = await testSubmissions.someoneHasSubmitted(req_data["_id"]);
        if(someoneHasSubmitted){
            return res.status(403).json({ error: "Unable to update test deatail. Because, a student has started the test" })
        }
        const { startDate, deadline } = req_data;
        if(new Date(startDate) >= new Date(deadline)){
            return res.status(406).send({"error": "Start date must be earlier than the deadline."});
        }

        const changed_data = {
            name: req_data.name,
            startDate: req_data.startDate,
            deadline: req_data.deadline,
        }
    
        let updated_test_data = await tests.editTestDetail(test_id, changed_data);
        res.status(200).json({"updated_test_data": updated_test_data});
    }
    catch(error){
        console.error(error);
        res.status(500).send({"error": "unable to edit test detail"})
    }
}
  