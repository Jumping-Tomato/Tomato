import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from "next-auth/next";
import { courses } from "database/courses";
import { tests } from "database/tests";
import { testSubmissions } from 'database/testSubmissions';
import { removeItemsFromArrayByValue, shuffle } from 'helpers/functions';
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
    const activities = useRef([]);
    const timerIdRef = useRef(null);
    const remainingSeconds = useRef(0);
    async function getUnansweredQuestion(){
      try{
        if(questionNumber < props.numOfQuestions){
          const params = {params: {testSubmissionId: props.testSubmission_id}};
          const response = await axios.get('/api/student/getTestQuestion', params)
          const questionObject = response.data.question;
          answers.current = [];
          activities.current = [];
          setQuestion(questionObject);
          setQuestionNumber(questionNumber+1);
        }
        else{
          await setTotalScore();
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
        answers.current = toggleValueFromArray(answers.current, value);
      }
      else{
        answers.current = [value];
      }
    }
    async function submitQuestion(){
      try{
        const questionObject = {...question};
        questionObject.answers = answers.current;
        questionObject.activities = activities.current;
        const data = {
          test_submission_id: props.testSubmission_id,
          question_data: questionObject
        }
        const response = await axios.post('/api/student/submitTestQuestion', data);
        if(response.status != 200){
          alert("An error has occured. Unable to submit questions.");
        }
      }
      catch(error){
        setError(error)
      }
    }
    useEffect(() => {
      getUnansweredQuestion();
      
      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
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
        clearTimer();
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
      if(remainingSeconds.current == 0){
        return;
      }
      submit();
    }

    function toggleValueFromArray(array, value){
      if(array.indexOf(value) > -1){
        array = removeItemsFromArrayByValue(array, value);
      }
      else{
        array.push(value);
      }
      return array;
    }

    function handleCopy(){
      const selection = document.getSelection();
      const actvity = {
        name: "copy",
        value:  selection.toString()
      }
      activities.current.push(actvity);
    }
    function handleCut(){
      const selection = document.getSelection();
      const actvity = {
        name: "cut",
        value:  selection.toString()
      }
      activities.current.push(actvity);
    }
    function handlePaste(event){
      const pastedText = event.clipboardData.getData('Text');
      const actvity = {
        name: "paste",
        value:  pastedText.toString()
      }
      activities.current.push(actvity);
    }
    function handleFocus(){
      const actvity = {
        name: "enter tab",
        value:  "user enter tab"
      }
      activities.current.push(actvity);
    }
    function handleBlur(){
      const actvity = {
        name: "exit tab",
        value:  "user exit tab"
      }
      activities.current.push(actvity);
    }
    function handleBeforeUnload(event){
      event.preventDefault();
      return event.returnValue = '';
    }
    async function setTotalScore(){
      try{
        const params = {
          test_submission_id: props.testSubmission_id
        }
        const response = await axios.post('/api/student/setTestTotalScore', params)
        if(response.status != 200){
          setError(response.error)
        } 
      }
      catch(error){
        setError(error)
      }
    }
    return (
        <>
           <div className={global.container}>
                <Head>
                    <title>Test: {props.title}</title>
                    <meta name="Test Taking Page" content="Taking the test" />
                    <link rel="icon" href="/media/images/logo.svg" />
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
                                  <TestQuestion question={question} handleChange={handleQuestionChange} handleCopy={handleCopy} handleCut={handleCut} handlePaste={handlePaste} />
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
  if (remainingTime <= 0) {
    return (<span style={{ marginLeft: '17px', fontSize: "12px"}}>  
            Too Late!
            </span>)
  }
  return (
    <h6 style={{ marginTop: '0.5rem'}}>  
      {remainingTime}
    </h6>
  );
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
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
  let testIsSubmitted = false;
  if(process.env.NODE_ENV != 'development'){
    testIsSubmitted = await testSubmissions.testIsSubmitted(test_id, uid);
  }
  const currentDateTime = new Date();
  if(!studentInCourse || testIsSubmitted || 
      currentDateTime < new Date(test_data.startDate) || 
      currentDateTime > new Date(test_data.deadline)
    ){
    return {
        redirect: {
            destination: "/error/forbidden",
        }
    }
  }
  let questions = test_data.questions ? test_data.questions : [];
  let unanswered_questions = [];
  questions.forEach(question => {
    const unanswered_question = JSON.parse(JSON.stringify(question));
    const correct_answers = unanswered_question.detail.correct_answers;
    const num_of_correct_answers = Object.keys(correct_answers).length;
    if(num_of_correct_answers > 1){
      unanswered_question.hasMultipleCorrectAnswers = true;
    }
    unanswered_questions.push(unanswered_question);
  });
  if(test_data.shuffle){
    unanswered_questions = shuffle(unanswered_questions);
  }
  const testSubmission_data = await testSubmissions.createTestSubmission({
    "test_id": test_data._id,
    "student_id": new ObjectId(uid),
    "unanswered_questions": unanswered_questions,
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