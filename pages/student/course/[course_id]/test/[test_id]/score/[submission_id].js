
import global from 'styles/Global.module.scss';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { courses } from 'database/courses';
import { tests } from 'database/tests';
import { testSubmissions } from 'database/testSubmissions';
import { Button, Table } from 'react-bootstrap';
import { getChoicesString, getCorrectAnswersString} from 'helpers/functions';
import {Topbar, Footer} from 'components';

export default function StudentScoreViewPage({answered_questions, total_score}) {
    
    return (
        <>
           <Topbar />
           <div className={global.container}>
                <Head>
                    <title>View Score</title>
                    <meta name="Student Score View Page" content="Student Score View Page" />
                    <link rel="icon" href="/images/logo.svg" />
                </Head>

                <main className={global.main}>
                    <div className='row justify-content-center'>
                        <div className="col-12 p-5">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th>Answer(s)</th>
                                        <th>Correct Answer(s)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                    answered_questions.map((each, index)=>{
                                        return  (
                                            <tr key={index}>
                                                <td>{ each.detail.question }</td>
                                                <td>{ each.answers }</td>
                                                <td>{ getCorrectAnswersString(each.type, each.correct_answers) }</td>
                                            </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                            Total Score: {total_score}
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
    const submission_id = context.params.submission_id;
    const uid = session._id;
    const course_data = await courses.getCourseById(course_id);
    const test_data = await tests.getTestById(test_id);
    const submissionData = await testSubmissions.getTestSubmissionById(submission_id);
    if(!course_data || !test_data || 
        test_data.course_id.toString() != course_id || 
        !submissionData || submissionData.test_id.toString() != test_id){
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
    return {
      props: {
        answered_questions: submissionData.answered_questions,
        total_score: submissionData.total_score
      }
    }
  }