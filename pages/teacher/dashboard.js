import { useSession } from 'next-auth/react'
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import { Topbar, Footer} from 'components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import  Link  from 'next/link';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function TeacherDashboard() {
    const { data: session } = useSession();
    const [courses, setCourses] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    
    useEffect(() => {
        setIsLoading(true);
        axios.get("/api/teacher/getCoursesForTeacher")
        .then(function (response) {
            let courses = response.data.courses;
            setCourses(courses);
            setIsLoading(false);
        })
        .catch(function (error) {
            setError(error.response.data.error);
        }); 
    },[]);
    return(
        <>
            <Topbar />
            <div className={global.container}>
                <Head>
                    <title>Dashboard Page - Teacher</title>
                    <meta name="description" content="Home Page" />
                    <link rel="icon" href="/media/images/logo.svg" />
                </Head>

                <main className={global.main}>
                    <div className='row'>
                        <div className="col-12 pt-1 row">
                            <div className="col-12 pt-5">
                                <Link href="/teacher/createCourse">
                                    <Button variant="primary" className="m-1 float-end" size="sm">
                                        <FontAwesomeIcon icon={faPlus} size="1x" />&nbsp;
                                        Create
                                    </Button>
                                </Link>
                            </div>
                            { error && <Alert variant="danger"> {error} </Alert> }
                            <div className="col-12 pt-5">
                                <h5>Courses:</h5>
                            </div>
                            <div className="col-12 pt-5">
                                { 
                                isLoading ? 
                                <Spinner animation="border" />
                                :
                                !courses.length ?
                                    <h1>No Courses</h1>
                                     :
                                     <ul className="list-group">
                                        {
                                            courses.map((course) => {
                                                return  (<li className="list-group-item" key={course._id}>
                                                            <div className="row">
                                                                <Link legacyBehavior={false}  href={"/teacher/course/" + course._id} className='col-6'>{course.name}</Link>
                                                                <span className='col-6'>{ course.semester }</span>
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