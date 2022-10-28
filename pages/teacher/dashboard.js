import { useSession } from 'next-auth/react'
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import Topbar from 'components/Topbar'
import Footer from 'components/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import  Link  from 'next/link';
import { Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function TeacherDashboard() {
    const { data: session } = useSession();
    const [courses, setCourses] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        axios.get("/api/teacher/getCoursesForTeacher")
        .then(function (response) {
            let courses = response.data.courses;
            setCourses(courses);
            setIsLoading(false);
        })
        .catch(function (error) {
            
        }); 
    },[]);
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
                                <Link href="/teacher/createCourse">
                                    <button type="button" className="float-end btn btn-primary">
                                        <FontAwesomeIcon icon={faPlus} size="1x" />&nbsp;
                                        Create
                                    </button>
                                </Link>
                            </div>
                            <div className="col-12 pt-5">
                                { 
                                isLoading ? 
                                <Spinner animation="border" />
                                :
                                !courses.length ?
                                    <h1>No Cources</h1>
                                     :
                                     <ul class="list-group">
                                        {
                                            courses.map((course) => {
                                                return  (<li className="list-group-item" key={course._id}>
                                                            <Link href={"/teacher/course/" + course._id}>{course.name}</Link>
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