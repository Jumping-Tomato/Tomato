import { getSession } from 'next-auth/react';
import { courses } from "database/courses";
import { tests } from "database/tests";
import { testSubmissions } from 'database/testSubmissions';
import { shuffle } from 'helpers/functions';
import { ObjectId } from "mongodb";
import global from 'styles/Global.module.scss';
import Head from 'next/head';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

export default function TestTakingPage({props}) {
    const [question, setQuestion] = useState(null);
    const [numOfQuestions, setNumOfQuestions] = useState(props.numOfQuestions);
    const [error, setError] = useState({});
    async function getUnansweredQuestion(){
      try{
        if(numOfQuestions){
          const params = {params: {testSubmissionId: props.testSubmission_id}};
          const response = await axios.get('/api/student/getTestQuestion', params)
          setQuestion(response.data.question);
          setNumOfQuestions(numOfQuestions-1);
        } 
      }
      catch(error){
        setError(error)
      }
    }
    async function submitQuestion(){
      try{
        const data = {
          test_submission_id: props.testSubmission_id,
          question_data: question
        }
        await axios.post('/api/student/submitTestQuestion', data);
      }
      catch(error){
        setError(error)
      }
    }
    useEffect(() => {
      getUnansweredQuestion();
    },[]);

    useEffect(() => {
      async function fetchMyAPI() {
        if(question){
          setTimeout(async () => {
            await submitQuestion();
            await getUnansweredQuestion();
          }, question.detail.time * 1000);
        }
      }
      fetchMyAPI()
    }, [question]);
    return (
        <>
           <div className={global.container}>
                <Head>
                    <title>Test: {props.title}</title>
                    <meta name="Test Taking Page" content="Taking the test" />
                    <link rel="icon" href="#" />
                </Head>

                <main className={global.main}>
                    <div className='row'>
                        <div className="col-12 pt-5">
                            {
                              question && 
                              <>
                                <CountdownCircleTimer
                                  isPlaying
                                  duration={question.detail.time}
                                  colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                                  colorsTime={[10, 6, 3, 0]}
                                  onComplete={() => ({ shouldRepeat: true, delay: 0 })}
                                >
                                  {renderTime}
                                </CountdownCircleTimer>
                                <h4>{question.detail.question}</h4>
                                {
                                  question.type == "multipleChoice" ?
                                  <Form>
                                    <Form.Group className="mb-3">
                                      <Form.Label>
                                        { question.hasMultipleCorrectAnswers ? "select the correct answers (More than one correct answer)" : "select the correct answer"}
                                      </Form.Label>
                                        {
                                          Object.entries(question.detail.choices).map(([key, value])=>{
                                            return <Form.Check
                                                      key={key}
                                                      type={question.hasMultipleCorrectAnswers ? "checkbox": "radio"}
                                                      label={`${key}: ${value}`}
                                                    />
                                          })
                                        }
                                    </Form.Group>    
                                  </Form> 
                                  :
                                  <Form>
                                    <Form.Group className="mb-3">
                                      <Form.Label>Type your answer below: </Form.Label>
                                      <Form.Control type="text" />
                                    </Form.Group>
                                  </Form>
                                }
                              </>
                            }
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

const renderTime = ({ remainingTime }) => {
  return (
    <div className="timer">
      <div className="value">{remainingTime}</div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const course_id = context.params.course_id;
  const test_id = context.params.test_id;
  const uid = session._id;
  const course_data = await courses.getCourseById(course_id);
  const test_data = await tests.getTestById(test_id);
  if(!course_data || !test_data || test_data.course_id.toString() != course_id){
    return {
      notFound: true
    }
  }
  const studentInCourse = await courses.isStudentInCourse(course_id, uid); 
  // const testIsSubmitted = await testSubmissions.testIsSubmitted(test_id, uid);
  const testIsSubmitted = false; //for development only, when finished, please remove this line and uncomment the line abobe
  if(!studentInCourse || testIsSubmitted){
    return {
        redirect: {
            destination: "/error/forbidden",
        }
    }
  }
  let questions = test_data.questions;
  let unanswered_questions = [];
  questions.forEach(question => {
    const unanswered_question = JSON.parse(JSON.stringify(question));
    if(unanswered_question.detail.correct_answers.length > 1){
      unanswered_question.hasMultipleCorrectAnswers = true;
    }
    //take out the correct_answers from the students
    delete unanswered_question.detail.correct_answers;
    unanswered_questions.push(unanswered_question);
  });
  const testSubmission_data = await testSubmissions.createTestSubmission({
    "test_id": test_data._id,
    "student_id": new ObjectId(uid),
    "unanswered_questions": shuffle(unanswered_questions),
    "answered_questions": []
  });
  const testSubmission_id =  testSubmission_data.insertedId.toString();
  let props = {
    title: test_data.name,
    course_id: course_id,
    test_id: test_id,
    testSubmission_id: testSubmission_id,
    numOfQuestions: unanswered_questions.length
  };
  return {
    props: {props}
  }
}