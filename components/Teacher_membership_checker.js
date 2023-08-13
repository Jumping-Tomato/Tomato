import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ErrorModal from './ErrorModal';
import { useSession } from 'next-auth/react'


export default function Teacher_membership_checker() {
    const router = useRouter();
    const { data: session } = useSession();
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(()=>{
        if(session?.role == "teacher"){
            axios.get("/api/teacher/isMembershipExpired")
            .then(function (response) {
                if(response.data){
                    router.push('/payment/checkout')
                }
            })
            .catch(function (error) {
                setShowErrorModal(true);
                console.log("Unable to determine if teacher's membership has expired");
                console.error(error);
            }); 
        }
    },[session])
    return (
        <>
            <ErrorModal show={showErrorModal} title="error" 
                message="An error has occured. Please contact customer support."
                closeButton={false}/>
        </>
    );
}