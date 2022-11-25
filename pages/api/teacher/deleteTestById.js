import { getToken } from "next-auth/jwt";
import { tests } from "database/tests";

export default async function deleteTestById(req, res) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if(session.role != "teacher"){
        res.status(403).json({ error: "forbidden" })
    }
    const { test_id } = req.body; 

    try {
        await tests.deleteTestById(test_id);
        res.status(200).send("success");
    }
    catch(error){
        res.status(500).send({"error": error})
    }
}
  