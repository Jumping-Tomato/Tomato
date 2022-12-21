import { getSession } from 'next-auth/react';
import { courses } from "database/courses";
import { tests } from "database/tests";
import { testSubmissions } from 'database/testSubmissions';
import { shuffle } from 'helpers/functions';
import { ObjectId } from "mongodb";
import global from 'styles/Global.module.scss';
import Head from 'next/head';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { TestQuestion } from 'components';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';


export default function TestTakingPage({props}) {
    const router = useRouter();
    const [question, setQuestion] = useState(null);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [error, setError] = useState({});
    const answers = useRef([]);
    const timerIdRef = useRef(null);
    const remainingSeconds = useRef(0);
    async function getUnansweredQuestion(){
      try{
        if(questionNumber < props.numOfQuestions){
          const params = {params: {testSubmissionId: props.testSubmission_id}};
          const response = await axios.get('/api/student/getTestQuestion', params)
          const questionObject = response.data.question;
          answers.current = [];
          setQuestion(questionObject);
          setQuestionNumber(questionNumber+1);
        }
        else{
          router.push('/student/dashboard')
        }
      }
      catch(error){
        setError(error)
      }
    }
    function handleQuestionChange(event){
      const value = event.target.value;
      const inputType = event.target.type;
      if(inputType == 'checkbox'){
        answers.current.push(value);
      }
      else{
        answers.current = [value];
      }
    }
    async function submitQuestion(){
      try{
        const questionObject = {...question};
        questionObject.answers = answers.current;
        const data = {
          test_submission_id: props.testSubmission_id,
          question_data: questionObject
        }
        const response = await axios.post('/api/student/submitTestQuestion', data);
        clearTimer();
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
          remainingSeconds.current = question.detail.time;
          timerIdRef.current = setInterval(async () => {
            if(!remainingSeconds.current){
              await submit();
            }
            else{
              remainingSeconds.current = remainingSeconds.current - 1;
            }        
          }, 1000);
        }
      }
      fetchMyAPI();
      return () => {
        clearInterval();
      };
    }, [questionNumber]);

    
    function clearTimer(){
      clearInterval(timerIdRef.current);
    }

    async function submit(){
      await submitQuestion();
      await getUnansweredQuestion();
    }
    function handleSubmitClick(event){
      event.preventDefault();
      if(remainingSeconds.current <= 1){
        return;
      }
      submit();
    }
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
                        <div className="col-12 pt-1 row">
                        {
                              question && 
                              <div key={question.id}>
                                <div className="col-12 p-2">
                                  {questionNumber}/{props.numOfQuestions}
                                </div>
                                <div className="col-12 pt-5 pb-1">
                                  <TestQuestion question={question} handleChange={handleQuestionChange} />
                                </div>
                                <div className="col-12 p-3">
                                  <Button className="float-end" size="sm" variant="success" onClick={handleSubmitClick}>
                                    Submit
                                  </Button>
                                </div>
                                <div className="col-12 pt-5">
                                  <CountdownCircleTimer
                                    isPlaying={true}
                                    duration={question.detail.time}
                                    size={60}
                                    strokeWidth={6}
                                    colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                                    colorsTime={[10, 6, 3, 0]}
                                    onComplete={() => ({ shouldRepeat: true, delay: 0 })}
                                  >
                                    {renderTime}
                                  </CountdownCircleTimer>
                                </div>  
                              </div>
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
    <h6 style={{ marginTop: '0.5rem'}}>  
      {remainingTime}
    </h6>
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