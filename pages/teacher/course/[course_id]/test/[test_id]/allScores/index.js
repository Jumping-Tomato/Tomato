import Head from 'next/head';
import global from 'styles/Global.module.scss';
import { Topbar, Footer } from 'components';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from "next-auth/next";
import { courses } from 'database/courses';
import { tests } from 'database/tests';
import { useRouter } from 'next/router';
import  Link  from 'next/link';
import { Button, Table } from 'react-bootstrap';
import { getDateFromDate, getTimeFromDate } from 'helpers/functions';

export default function AllScore({props}) {
    const router = useRouter();
    const title = `Test Score - ${props.test_name}`;
    const {course_id, test_id} = router.query;
    const [scores, setScores] = useState([]);
    const [error, setError] = useState("");
    async function getScores(){
      try{
        const params = {params: {test_id:  router.query.test_id}};
        const response = await axios.get("/api/teacher/getAllTestScores", params)
        setScores(response.data.score_data);
      }
      catch(error){
        setError(error);
      }
    }
    useEffect(() => {
      getScores();
    }, []);
    
    return (
        <>
        <Topbar />
        <div className={global.container}>
          <Head>
            <title>{title}</title>
            <meta name="description" content="View All Score Page" />
            <link rel="icon" href="/media/images/logo.svg" />
          </Head>
     
          <main className={global.main}>
          <div className='row justify-content-center'>
              <div className="col-12 p-5">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Time Of Submission</th>
                      <th>score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      scores.map((each, index)=>{
                        return  (
                          <tr key={index}>
                            <td>{ each.student[0].firstName }</td>
                            <td>{ each.student[0].lastName }</td>
                            <td>{ getDateFromDate(new Date(each.dateUpdated)) } { getTimeFromDate(new Date(each.dateUpdated)) }</td>
                            <td>{ each.total_score }</td>
                            <td>
                              <Button 
                                href={`/teacher/course/${course_id}/test/${test_id}/submission-detail/${each._id}`}>
                                  View Detail
                                </Button>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </div>
          </div>
          </main>
        </div>
        <Footer />
      </>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
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
      test_name: test_data.name,
    };
    return {
      props: {props}
    }
  }