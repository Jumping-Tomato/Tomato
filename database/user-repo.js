import { getDB } from "database/mongodb-config";
const { ObjectId } = require('mongodb')
import { nanoid } from 'nanoid';
import { send_no_reply_email } from "helpers/email";



export const usersRepo = {
    getAll: async () => {
        const db = await getDB();
        return await db.collection("users").find({}).toArray();
    },
    getById: async _id => {
        const db = await getDB();
        return await db.collection("users").findOne({"_id": ObjectId(_id)});
    },
    find: async email => {
        const db = await getDB();
        return await db.collection("users").findOne({"email": email});
    } ,
    create,
    update,
    delete: _delete,
    verifyUserEmail:verifyUserEmail
};

async function create(user) {
    try{
        // set date created and updated
        user.dateCreated = new Date().toISOString();
        user.dateUpdated = new Date().toISOString();
        
        //set email verification fields
        user.email_verified = false;
        user.email_verification_code = nanoid();
        // add and save user
        const db = await getDB();
        let result = await db.collection("users").insertOne(user);
        if(result){
            const recipient = [{
                address: user.email,
                name: user.firstName + ' ' + user.lastName
            }];
            const subject = "Verify Your Email Address";
            const html = `Please click on the link to verify your email address: 
                           <a href="${process.env.DOMAIN_URL + '/auth/verify-email/' + user.email_verification_code}">Link</a>`
            const email_sent = await send_no_reply_email(recipient,subject,html);
            if (email_sent){
                return true;
            }
            return false;
        }
    }
    catch(error){
        console.error(error);
        throw `Unable to create user with the email "${user.email}"`;
    }
}

async function update(_id, params) {
    params.dateUpdated = new Date().toISOString();
    const db = await getDB();
    return db.collection("users").updateOne({"_id": ObjectId(_id)},{$set: params})
    .then((result)=>{
        console.log(`user with id "${_id}" is updated is mongoDB`);
        console.log(result);
    })
    .catch((error)=>{
        throw `Unable to update the user.\nError: "${error}"`;
    });
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(_id) {
    try{
        const db = await getDB();
        let result = await db.collection("users").deleteOne({"_id": _id });
        return result
    }
    catch(error){
        throw `Unable to delete the user.\nError: "${error}"`;
    }
}

async function verifyUserEmail(email_verification_code){
    try{
        const db = await getDB();
        let user = await db.collection("users").findOne({"email_verification_code": email_verification_code });
        if(!user){
            return false;
        }
        const result = await db.collection("users")
                    .updateOne({"_id": user._id },
                                {
                                    $set: {'email_verified': true},
                                    $unset:{'email_verification_code': ''}
                                }
                            );
        if(result.modifiedCount){
            return true;
        }
        return false;          
    }
    catch(error){
        throw `Unable to delete the user.\nError: "${error}"`;
    }
}
