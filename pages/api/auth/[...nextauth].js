import NextAuth from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import { usersRepo } from 'database/user-repo';
import { verifyCaptcha } from 'helpers/functions';
 
const bcrypt = require('bcryptjs');

export default NextAuth({
    providers: [
        CredentialProvider({
            name: "credentials",
            credentials: {
                    email: {label: "Email", type:"email", placeholder:"johnDoe@test.com"},
                    password: {label: "Password", type:"password"}
            },
            authorize: async (credentials)=>{
                const isCaptchaValid = await verifyCaptcha(credentials.captchaValue);
                if(!isCaptchaValid){
                    throw 'Invalid Captcha Value';
                }
                //database look up
                const email = credentials.email;
                const password = credentials.password;

                const user = await usersRepo.find(email);
  
                if (!(user && bcrypt.compareSync(password, user.hash))) {
                    throw 'Email or password is incorrect';
                }
                
                return user;
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
            jwt: ({token, user})=> {
                if(user){
                    token._id = user._id;
                    token.role = user.role;
                }
                return token;
            },
            session: ({session, token})=>{
                if(token){
                    session._id = token._id;
                    session.role = token.role;
                }
                return session;
            }
    },
    pages: {
        signIn: "/auth/signin"
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        encryption: true
    }
})