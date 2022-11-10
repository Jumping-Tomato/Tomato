import Head from 'next/head';
import global from 'styles/Global.module.scss';
import { Topbar,QuestionCard, Footer } from 'components';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { courses } from 'database/courses';
import { tests } from 'database/tests';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default function TestManagementPage({props}) {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    function addQuestion(event){
      event.preventDefault();
      const newQuestion = {
        type: "multipleChoice",
        multipleChoice:
        {
          question:"",
          choices:{
              a:""
          },
          correct_choice: "a"
        },
        shortAnswer:
        {
          question:"",
          correct_answer:""
        }
      }
      setQuestions(currentQuestions => [...currentQuestions, newQuestion])
    }
    function removeQuestionCard(questionCardIndex){
      let new_questions = [...questions];
      new_questions.splice(questionCardIndex,1);
      setQuestions(new_questions);
    }
    function updateQuestion(index, question){
      let new_questions = [...questions];
      new_questions[index] = question;
      setQuestions(new_questions);
    }
    function handleSave(event){
      event.preventDefault();
      const test_id  = router.query.test_id;
      const url = "/api/teacher/saveQuestions";
      const data = {
        test_id: test_id,
        questions_data:questions,
      }
      axios.put(url, data)
      .then(function (response) {
        // router.push("/teacher/dashboard");
      })
      .catch(function (error) {
        console.error(error);
      }); 
    }
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
              <div className="col-12 p-5 row">
                <div className="col-12 pt-1">
                  <Button variant="primary" className="float-end" size="sm" onClick={addQuestion}>
                    <FontAwesomeIcon icon={faPlus} size="1x" />&nbsp;
                            add a question
                  </Button>
                </div>
                <h1>{"Test -" +  props.name}</h1>
                <ul className="list-group">
                  {
                    questions.map((question, index)=>{
                      return  (
                              <li className="list-group-item border-0" key={index}>
                                <QuestionCard props={question} title={"Question " + (index + 1)} updateQuestion={function(question){updateQuestion(index, question)}} handleRemoveButtonClick={ ()=>{ removeQuestionCard(index) } }/>
                              </li>
                            );
                    })
                  }
                </ul>     
              </div>
              <div className="col-12 p-2 row">
                <div className="col-2 ps-xl-5 row">
                  <Button variant="primary" onClick={handleSave}>
                      Save
                  </Button>
                </div>
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