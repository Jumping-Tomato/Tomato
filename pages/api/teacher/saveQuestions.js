import { getToken } from "next-auth/jwt"
import { tests } from "database/tests"

export default async function saveQuestions(req, res) {
    const session = await getToken({ req })
    if(!session || session.role != "teacher"){
        return res.status(403).json({ error: "forbidden" })
    }
    const {test_id, questions_data} = req.body;
  
    try {
        const test = await tests.getTestById(test_id);
        if (!test){
            return res.status(404).send({"error": "Not Found"})
        }
        await tests.updateQuestions(test_id, questions_data);
        return res.status(200).send("success");
    }
    catch(error){
        return res.status(500).send({"error": error})
    }
}