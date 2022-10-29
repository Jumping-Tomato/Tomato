import { useSession } from 'next-auth/react'
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import Topbar from 'components/Topbar'
import Footer from 'components/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {Spinner} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function StudentDashboard() {
    const { data: session } = useSession();
    const [courses, setCourses] = useState("");
    useEffect(() => {
        axios.get("/api/getCoursesForStudent")
        .then(function (response) {
            let courses = response.data.courses;
            setCourses(courses)
        })
        .catch(function (error) {
            
        }); 
    },[]);
    const [showPopup, setShowPopup] = useState(false);
    return(
        <>
            <Topbar />
            <div className={global.container}>
                <Head>
                    <title>Dashboard Page - {session ? session.role : ""}</title>
                    <meta name="description" content="Home Page" />
                    <link rel="icon" href="#" />
                </Head>

                <main className={global.main}>
                    <div className='row'>
                        <div className="col-12 pt-1">
                            <div className="col-12 pt-5">
                                <button type="button" className="float-end btn btn-primary" onClick={() => setShowPopup(true)}>
                                    <FontAwesomeIcon icon={faPlus} size="1x" />&nbsp;
                                    Add
                                </button>
                            </div>
                            <div className="col-12 pt-5">
                                { !courses.length ?
                                    <Spinner animation="border" />
                                     :
                                     <ul class="list-group">
                                        {
                                        courses.map((course) => {
                                            return  (<li className="list-group-item" key={course._id}>
                                                        {course.name}
                                                    </li>);
                                        })
                                        }
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}