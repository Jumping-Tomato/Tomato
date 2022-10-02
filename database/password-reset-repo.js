import dbPromise from "database/mongodb-config";
import { usersRepo } from "database/user-repo";

let db;
dbPromise.then((value) => {
    const client = value;
    db = client.db("Tomato");
})
.catch((error)=>{
    console.error(error);
});

export const passwordResetRepo = {
    sendPasswordResetLink,
};

async function sendPasswordResetLink(email) {
    let user;
    try{
        user = await usersRepo.find(email);
    }
    catch(error){
        throw error;
    }
    if(!user){
        throw `Unable to find an user associated the email "${email}"`;
    }
    var minutesToAdd = 15;
    var currentDate = new Date();
    const expire = new Date(currentDate.getTime() + minutesToAdd*60000).toString();
    let pw_reset_data = {
        user_id: user._id,
        expire: expire
    }
    try{
        let result = await db.collection("passwordReset").updateOne(
            {user_id: user._id},
            {$set: pw_reset_data},
            {upsert: true}
        )
        return result;
    }
    catch(error){
        console.error(error);
        throw `Unable to generate password reset link. Error: "${error}"`;
    }
}
