import { getToken } from "next-auth/jwt"
import { tests } from "database/tests"
const { ObjectId } = require('mongodb')

export default async function editTestDetail(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if(session.role != "teacher"){
        res.status(403).json({ error: "forbidden" })
    }
    const req_data = req.body;
    const { type, length, startDate, deadline } = req_data;
    if(new Date(startDate) >= new Date(deadline)){
        return res.status(406).send({"error": "Start date must be earlier than the deadline."});
    }
    /* the difference in time between deadline and start date.
    * The difference between two dates is in miliseconds. So, I need to
    * convert it to seconds, and then to minitues.
    */
    const timeDiff = (new Date(deadline) - new Date(startDate))/1000/60;
    if(timeDiff < length){
        return res.status(406).send({"error": `Not enough time to finish the ${type}. Please shorten the length or change the start date or deadline.`});
    }
    const test_id = req_data["_id"];
    const changed_data = {
        name: req_data.name,
        startDate: req_data.startDate,
        deadline: req_data.deadline,
    }
    try {
        await tests.updateTestDetail(test_id, changed_data);
        res.status(200).send("success");
    }
    catch(error){
        console.error(error);
        res.status(500).send({"error": "unable to edit test detail"})
    }
}
  