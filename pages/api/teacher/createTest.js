import { getToken } from "next-auth/jwt"
import { tests } from "database/tests"
const { ObjectId } = require('mongodb')

export default async function createTest(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if(session.role != "teacher"){
        res.status(403).json({ error: "forbidden" })
    }
    const req_data = req.body;
    const { type, length, startDate, deadline } = req_data;
    if(new Date(startDate) >= new Date(deadline)){
        return res.status(406).send({"error": "Start date must be earlier than the deadline."});
    }

    if(req_data["course_id"]){
        req_data["course_id"] = ObjectId(req_data["course_id"]);
    }  

    try {
        await tests.createTest(req_data);
        res.status(200).send("success");
    }
    catch(error){
        res.status(500).send({"error": error})
    }
}
  