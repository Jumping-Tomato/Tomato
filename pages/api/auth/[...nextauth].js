import NextAuth from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'

export default NextAuth({
    providers: [
        CredentialProvider({
            name: "credentials",
            credentials: {
                    email: {label: "Email", type:"email", placeholder:"johnDoe@test.com"},
                    password: {label: "Password", type:"password"}
            },
            authorize: (credentials)=>{
                //database look up
                if(credentials.email === "ronganlihappyday@gmail.com" && credentials.password === "wakanda"){
                    return {
                        id: 2,
                        name: "Rongan",
                        email: credentials.email
                    }
                }
                throw "Your mom";
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
            jwt: ({token, user})=> {
                if(user){
                    token.id = user.id;
                }
                return token;
            },
            session: ({session, token})=>{
                if(token){
                    session.id = token.id;
                }
                return session;
            }
    },
    pages: {
        signIn: "/auth/signin"
    },
    jwt: {
        secret:"test",
        encryption: true
    }
})