import Head from 'next/head';
import global from 'styles/Global.module.scss';
import { Topbar, Footer } from 'components';
import axios from 'axios';
import { Fragment, useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { courses } from 'database/courses';
import { tests } from 'database/tests';
import { useRouter } from 'next/router';
import { Table } from 'react-bootstrap';

export default function TestSubmissionDetail({props}) {
    const router = useRouter();
    const title = `Test Score - ${props.test_name}`;
    const [pointData, setPointData] = useState([]);
    const [activityData, setActivityData] = useState([]);
    const [error, setError] = useState("");

    async function getPointData(){
      try{
        const params = {params: {test_submission_id: router.query.test_submission_id}};
        const response = await axios.get("/api/teacher/getPointsByTestSubmissionId", params);
        setPointData(response.data.point_data);
      }
      catch(error){
        setError(error);
      }
    }

    async function getActivityData(){
      try{
        const params = {params: {test_submission_id: router.query.test_submission_id}};
        const response = await axios.get("/api/teacher/getActivitiesByTestSubmissionId", params);
        setActivityData(response.data.activity_data);
      }
      catch(error){
        setError(error);
      }
    }

    useEffect(() => {
      getPointData();
      getActivityData();
    }, []);
    
    return (
        <>
        <Topbar />
        <div className={global.container}>
          <Head>
            <title>{title}</title>
            <meta name="description" content="View Score Page" />
            <link rel="icon" href="#" />
          </Head>
     
          <main className={global.main}>
          <div className='row justify-content-center'>
              <div className="col-12 p-5">
                <div>
                  <h6>Points: </h6>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Choices</th>
                        <th>Answer(s)</th>
                        <th>Correct Answer(s)</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        pointData.map((each, index)=>{
                          return  (
                            <tr key={index}>
                              <td>{ each.question }</td>
                              <td>{ each.type == "multipleChoice" ? getChoicesString(each.choices) : "NA"}</td>
                              <td>{ each.answers }</td>
                              <td>{ getCorrectAnswersString(each.type, each.correct_answers) }</td>
                              <td>{ each.score }</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                </div>
                <div className='mt-5'>
                  <h6>Activities: </h6>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Action(s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        activityData.map((each, index)=>{
                          return  (
                            <tr key={index}>
                              <td>{ each.question }</td>
                              <td>
                                { 
                                  each.activities.map((activity, index)=>{
                                      return (
                                              <Fragment key={index}>
                                                {activity.name}: {activity.value}<br/>
                                              </Fragment>
                                      )
                                  }) 
                                }
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                </div>  
              </div>
          </div>
          </main>
        </div>
        <Footer />
      </>
    );
}
function getChoicesString(choices){
    let choiceString = "";
    for (const [key, value] of Object.entries(choices)) {
      choiceString += (key + ": " + value + "\n");
    }
    return choiceString;
}

function getCorrectAnswersString(type, correct_answers){
  let correct_answers_string = "";
  if(type == "multipleChoice"){
    for (const [key, value] of Object.entries(correct_answers)) {
      correct_answers_string += (key + ": " + value.point + "\n");
    }
    return correct_answers_string;
  }
  correct_answers.forEach((each)=>{
    correct_answers_string += (each.answer + ": " + each.point + "\n");
  });
  return correct_answers_string;
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
    
    let props = {};
    return {
      props: {props}
    }
  }