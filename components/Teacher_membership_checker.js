import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Teacher_membership_checker() {
    const router = useRouter();
    useEffect(()=>{
        axios.get("/api/teacher/isMembershipExpired")
        .then(function (response) {
            if(response.data){
                router.push('/payment/checkout')
            }
        })
        .catch(function (error) {
            console.log("Unable to determine if teacher's membership has expired");
            console.error(error);
        }); 
    },[])
    return (
        <></>
    );
}