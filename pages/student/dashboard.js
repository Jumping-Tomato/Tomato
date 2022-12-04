import { useSession } from 'next-auth/react'
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import { Topbar, Footer } from 'components'
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        axios.get("/api/student/getCoursesForStudent")
        .then(function (response) {
            let courses = response.data.courses;
            setCourses(courses)
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
                                { 
                                    courses.length > 0
                                    &&
                                    <ul class="list-group">
                                        {
                                            courses.map((course) => {
                                                return  (<li className="list-group-item" key={course._id}>
                                                            <div class="row">
                                                                <div className="col-6">
                                                                    {course.name} 
                                                                </div>
                                                                <div className="col-5">
                                                                    {course.semester}
                                                                </div>
                                                                <div className="col-1">
                                                                    <Button href={`/student/course/${course._id}`}>
                                                                        Go
                                                                    </Button>
                                                                </div>
                                                            </div>
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