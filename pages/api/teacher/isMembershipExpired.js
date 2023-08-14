import { getToken } from "next-auth/jwt";
import { usersRepo } from "database/user-repo";

export default async function isMembershipExpired(req, res) {
    const session = await getToken({ req })
    if(!session || session.role != "teacher"){
        return res.status(403).json({ error: "forbidden" })
    }
    try {
        let _id  = session._id;
        const user_data = await usersRepo.getById(_id);
        if(user_data.membership_expiration_date && new Date() < new Date(user_data.membership_expiration_date)){
            return res.status(200).send(false);
        }
        return res.status(200).send(true);
    }   
    catch(error){
        console.error(error);
        return res.status(500).send({"error": error})
    }
}