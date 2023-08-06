import { getDB } from "database/mongodb-config";
import { usersRepo } from "database/user-repo";
const { ObjectId } = require('mongodb')



export const passwordResetRepo = {
    find: async _id => {
        const db = await getDB();
        return await db.collection("passwordReset").findOne({"_id": ObjectId(_id)});
    },
    resetPassword,
};

async function resetPassword(email) {
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
        const db = await getDB();
        await db.collection("passwordReset").updateOne(
            {user_id: user._id},
            {$set: pw_reset_data},
            {upsert: true}
        );
        let pwResetDocument = await db.collection("passwordReset").findOne(
            {user_id: user._id},
        );
        if(pwResetDocument){
            return pwResetDocument._id;
        }
        return null;
    }
    catch(error){
        console.error(error);
        throw `Unable to generate password reset link. Error: "${error}"`;
    }
}
