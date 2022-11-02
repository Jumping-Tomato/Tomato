import Head from 'next/head';
import global from 'styles/Global.module.scss';
import Topbar from 'components/Topbar';
import Footer from 'components/Footer';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { courses } from 'database/courses';
import { tests } from 'database/tests';


export default function TestManagementPage({props}) {
    const [questions, setQuestions] = useState([]);
    return (
        <>
        <Topbar />
        <div className={global.container}>
          <Head>
            <title>{"Test -" +  props.name}</title>
            <meta name="description" content="student Add Course Page" />
            <link rel="icon" href="#" />
          </Head>
     
          <main className={global.main}>
            <div className='row justify-content-center'>
              <div className="col-12 p-5">
                <h1>{props.name}</h1>
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
  const test_id = context.params.test_id;
  const uid = session._id;
  const course_data = await courses.getCourseById(course_id);
  if(!course_data){
    return {
      notFound: true
    }
  }
  const teacher_id = course_data.teacher_id;
  if(teacher_id != uid){
    return {
      redirect: {
        destination: "/error/forbidden",
      }
    }
  }
  const test_data = await tests.getTestById(test_id);
  if(!test_data || test_data.course_id.toString() != course_id){
    return {
      notFound: true
    }
  }
  let props = {
    name: test_data.name
  };
  return {
    props: {props}
  }
}