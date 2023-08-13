import { useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function Teacher_membership_checker() {
    const { data: session } = useSession();
    useEffect(()=>{
        axios.get("/api/teacher/isMembershipExpired")
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.error(error);
        }); 
    },[session])
    return (
        <></>
    );
}