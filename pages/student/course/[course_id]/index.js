import { getSession } from 'next-auth/react';
import Head from 'next/head';
import global from 'styles/Global.module.scss';
import { Topbar, Footer } from 'components';
import { courses } from 'database/courses';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { Button } from 'react-bootstrap';
import { getDateFromDate, getTimeFromDate } from 'helpers/functions';

export default function StudentCoursePage({props}) {
    const [tests, setTests] = useState([]);
    useEffect(() => {
        const params = {params: {course_id: props.course_id}};
        axios.get("/api/student/getTests",params)
        .then(function (response) {
            let test_list = response.data.tests;
            setTests(test_list);
        })
        .catch(function (error) {
            alert("Unable to load tests. Please contact customer support!");
            console.error(error);
        }); 
    },[]);
    return(
        <>
            <Topbar />
            <div className={global.container}>
                <Head>
                    <title></title>
                    <meta name="description" content="Studen Course Page" />
                    <link rel="icon" href="#" />
                </Head>

                <main className={global.main}>
                    <div className='row'>
                        <div className="col-12 pt-5">
                        { 
                            tests.length > 0
                            &&
                            <ul class="list-group">
                                {
                                    tests.map((test) => {
                                        return  (<li className="list-group-item" key={test._id}>
                                                    <div class="row">
                                                        <div className="col-3">
                                                            {test.name} 
                                                        </div>
                                                        <div className="col-4">
                                                            Earliest Start Time: { getDateFromDate(new Date(test.startDate)) } { getTimeFromDate(new Date(test.startDate)) }
                                                        </div>
                                                        <div className="col-4">          
                                                            Deadline: { getDateFromDate(new Date(test.deadline)) } { getTimeFromDate(new Date(test.deadline)) }
                                                        </div>
                                                        <div className="col-1">
                                                            <Button href={`/student/course/${props.course_id}/test/${test._id}`}>
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
                </main>
            </div>
            <Footer />
        </>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    const course_id = context.params.course_id;
    const uid = session._id;
    const course = await courses.getCourseById(course_id);
    if(!course){
        return {
            notFound: true
        }
    }
    const studentInCourse = await courses.isStudentInCourse(course_id, uid);
    if(!studentInCourse){
        return {
            redirect: {
                destination: "/error/forbidden",
            }
        }
    }
    let props = {
        course_id: course_id
    };
    return {
        props: {props}
    }
}