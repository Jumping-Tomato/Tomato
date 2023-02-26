import Head from 'next/head';
import global from 'styles/Global.module.scss';
import { Topbar,QuestionCard, Footer } from 'components';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import {useRouter } from 'next/router';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from "next-auth/next";
import { courses } from 'database/courses';
import { tests } from 'database/tests';
import { Alert, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { nanoid } from 'nanoid'
import { useBeforeunload } from 'react-beforeunload';

export default function TestManagementPage({props}) {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [modalData, setModalData] = useState({
      show: false,
      message:""
    });
    const [hasUnsaved, setHasUnsaved] = useState(false);
    useEffect(() => {
      //populate the questions
      const currentQuestions = props.questions;
      let questionsArray = []
      currentQuestions.forEach((each)=>{
        const question = structuredClone(emptyQuestion);
        question.id = each.id;
        question.type = each.type;
        if(each.type == "multipleChoice"){
          question.multipleChoice = each.detail;
        }
        else{
          question.shortAnswer = each.detail;
        }
        questionsArray.push(question);
      });
      setQuestions(questionsArray);
    },[]);
    useEffect(()=>{
      setHasUnsaved(true);
    },[questions]);
    useBeforeunload((event) => {
      if (hasUnsaved) {
        event.preventDefault();
      }
    });
    const emptyQuestion = {
      id: nanoid(),
      type: "multipleChoice",
      multipleChoice:
      {
        question:"",
        files: [],
        choices:{
            a:""
        },
        correct_answers: {
          a:{
            point: 1
          }
        },
        time: 60
      },
      shortAnswer:
      {
        question:"",
        files: [],
        correct_answers:[
          {
            key: nanoid(),
            answer: "",
            point: "",
          }
        ],
        time: 60
      }
    }
    function addQuestion(event){
      event.preventDefault();
      const newQuestion = structuredClone(emptyQuestion);
      setQuestions(currentQuestions => [...currentQuestions, newQuestion])
    }

    const removeQuestionCard = useCallback((questionCardIndex)=>{
      let new_questions = [...questions];
      new_questions.splice(questionCardIndex,1);
      setQuestions(new_questions);
    },[questions.length]);

    const updateQuestionAtIndex = useCallback((index, question) =>{
      let new_questions = [...questions];
      new_questions[index] = question;
      setQuestions(new_questions);
    },[questions.length]);

    function handleSave(event){
      event.preventDefault();
      if(!questions.length){
        showModal(false,"No Questions to Save!");
        return;
      }
      const test_id  = router.query.test_id;
      const url = "/api/teacher/saveQuestions";
      const data = {
        test_id: test_id,
        questions_data:questions,
      }
      axios.put(url, data)
      .then(function (response) {
        showModal(true,"Question(s) have been saved.");
        setHasUnsaved(false);
      })
      .catch(function (error) {
        showModal(false,error.response.data.error);
      }); 
    }

    function showModal(isSuccess, message){
      const modal_data = {
        show: true,
        type: (isSuccess ? "success": "error"),
        message: message
      }
      setModalData(modal_data);
    }

    function closeModal(event){
      event.preventDefault();
      const modal_data = {
        show: false,
        message: ""
      }
      setModalData(modal_data)
    }
    
    return (
        <>
        <Topbar />
        <div className={global.container}>
          <Head>
            <title>{"Test -" +  props.name}</title>
            <meta name="description" content="student Add Course Page" />
            <link rel="icon" href="/media/images/logo.svg" />
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
                {
                  questions.length > 0 ?
                    <ul className="list-group">
                      {
                        questions.map((question, index)=>{
                          return  (
                                  <li className="list-group-item border-0" key={question.id}>
                                    <QuestionCard props={question} title={"Question " + (index + 1)} index={index} updateQuestionAtIndex={updateQuestionAtIndex} handleRemoveButtonClick={ removeQuestionCard }/>
                                  </li>
                                );
                        })
                      }
                    </ul>
                  :
                  <div className='col-12 p-5'>
                    <h4 className='text-center'>Please add Questions</h4>
                  </div> 
                } 
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
        <Modal show={modalData.show} onHide={closeModal}>
          <Modal.Header closeButton={true}>
            <Modal.Title>{ modalData.type }!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant={ modalData.type == "success" ? "primary" : "danger" }>
              {modalData.message}
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
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
  
  if (new Date() >= new Date(test_data.startDate)){
    //You can no longer edit the questions after the start time of the test.
    return {
      redirect: {
        destination: "/error/forbidden",
      }
    }
  }
  const questions = test_data.questions ?  test_data.questions : []
  let props = {
    name: test_data.name,
    questions: questions
  };
  return {
    props: {props}
  }
}