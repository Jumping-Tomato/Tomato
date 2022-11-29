import { getSession } from 'next-auth/react';
import Head from 'next/head';
import global from 'styles/Global.module.scss';
import { Topbar, Footer } from 'components';
import { courses } from 'database/courses';


export default function StudentCoursePage({props}) {
    
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
                        <div className="col-12 pt-1">
                            {props.course_id}
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
    let isStudentInCourse = false;
    let studentsArray = course.students;
    for (let i = 0; i < studentsArray.length; i++){
        if(studentsArray[i].toString() == uid){
            isStudentInCourse = true;
            break;
        }
    }
    if(!isStudentInCourse){
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