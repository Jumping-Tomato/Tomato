import Head from 'next/head';
import global from 'styles/Global.module.scss';
import Topbar from 'components/Topbar';
import Footer from 'components/Footer';
import CreateTestForm from 'components/CreateTestForm';
import axios from 'axios';
import { Button, Tab, Col, Nav, Row,Spinner, Modal, Form} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { courses } from 'database/courses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default function CourseManagementPage({props}) {
    const [students, setStudents] = useState({
      "type":{
        "enrolled":[],
        "pending":[]
      }
    });
    const [tests, setTests] = useState();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    let [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
    function loadStudents(){
      const url = '/api/teacher/getStudentsByCourseId';
      const params = {params: {course_id: props.course_id}};
      setIsLoading(true);
      axios.get(url, params)
      .then(function (response) {
        const enrolledStudentObjectArray = response.data.students.students; 
        const pendingStudentObjectArray = response.data.students.pending_students;
        const new_students_state = {
          "type":{
            "enrolled": enrolledStudentObjectArray,
            "pending": pendingStudentObjectArray
          }
        };
        setStudents(new_students_state);
        setIsLoading(false);
      })
      .catch(function (error) {
        setError(error.response.data.error);
        setIsLoading(false);
      }); 
    }
    function loadTests(){
      const url = '/api/teacher/getTestsByCourseId';
      const params = {params: {course_id: props.course_id}};
      axios.get(url, params)
      .then(function(response){
        const test_array_object = {};
        const testArray = response.data.tests; 
        testArray.forEach((test)=>{
          const type = test.type;
          if(test_array_object[type]){
            test_array_object[type].push(test);
          }
          else{
            test_array_object[type] = [test];
          }
        });
        setTests(test_array_object);
      })
      .catch(function (error) {
        setError(error.response.data.error);
      }); 
    }
    function handleStudent(event){
      const _id = event.target.value;
      const index = Number(event.target.getAttribute("data-index"));
      const data = {
        "course_id": props.course_id,
        "student_id": _id
      };
      const action_type = event.target.getAttribute("data-action-type");
      const url = action_type == "approve" ? "/api/teacher/approveStudent" : "/api/teacher/denyStudent"
      axios.post(url, data)
      .then(function (response) {
        let student = Object.assign({}, students.type.pending[index]);
        let new_students_state = {...students};
        new_students_state.type.pending.splice(index,1);
        if (action_type == "approve"){
          new_students_state.type.enrolled.push(student);
        }
        setStudents(new_students_state);
      })
      .catch(function (error) {
        setError(error.response.data.error);
        setIsLoading(false);
      });
    }
    useEffect(() => {
      loadStudents();
      loadTests();
    },[]);
    function closeCreateQuizModal() {
      setShowCreateQuizModal(false);
    }
    return (
        <>
        <Topbar />
        <div className={global.container}>
          <Head>
            <title>Course Page</title>
            <meta name="description" content="student Add Course Page" />
            <link rel="icon" href="#" />
          </Head>
     
          <main className={global.main}>
            <div className='row justify-content-center'>
              <div className="col-12 p-5">
              <Tab.Container id="course-tab" defaultActiveKey="student">
                <Row>
                  <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="student">Student</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="quiz">Quiz</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="score">Score</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col sm={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey="student">
                        <div className='p-2'>
                          <ul className="list-group">
                            {
                              isLoading ?
                              <Spinner animation="border" />
                              :
                              students.type.enrolled.length ?
                              students.type.enrolled.map(function(student){
                                return (
                                  <li className="list-group-item" key={student._id}>
                                    <div className='row'>
                                      <span className='col-12'>
                                        {student.lastName}, {student.firstName}
                                      </span>
                                    </div>      
                                  </li>);
                              })
                              :
                              <li className="list-group-item">
                                No Enrolled student
                              </li>
                            }
                          </ul>
                        </div>
                        <div className='p-2 mt-5'>
                          <ul className="list-group">
                            {
                            isLoading ?
                            <Spinner animation="border" />
                            :
                            students.type.pending.length ?
                              students.type.pending.map(function(student,index){
                                return (
                                  <li className="list-group-item" key={student._id}>
                                    <div className='row'>
                                      <span className='col-9'>
                                        {student.lastName}, {student.firstName}
                                      </span>
                                      <span className='col-3' onClick={handleStudent}>               
                                        <Button variant="primary" className="m-1" size="sm" data-index={index} data-action-type="approve" value={student._id}>Approve</Button>
                                        <Button variant="danger"  className="m-1" size="sm" data-index={index} data-action-type="reject" value={student._id}>Reject</Button>             
                                      </span>
                                    </div>      
                                  </li>);
                              })
                              :
                            <li className="list-group-item">
                              No pending student
                            </li>
                            }
                          </ul>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="quiz">
                        <div>
                          <Button variant="primary" className="float-end" size="sm" onClick={()=>{setShowCreateQuizModal(true)}}>
                            <FontAwesomeIcon icon={faPlus} size="1x" />&nbsp;
                                    Create a Quiz
                          </Button>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="score">
                        <h1>wakanda 3</h1>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
              </div>
            </div>
          </main>
        </div>
        <Footer />
        <Modal show={showCreateQuizModal} onHide={closeCreateQuizModal}>
          <Modal.Header closeButton={true}>
            <Modal.Title>Create a Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateTestForm course_id={props.course_id} onSuccessCallback={closeCreateQuizModal}/>
          </Modal.Body>          
        </Modal>
      </>
    );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const course_id = context.params.course_id;
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
  let props = {
    course_id: course_id
  };
  return {
    props: {props}
  }
}