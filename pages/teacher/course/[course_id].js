import Head from 'next/head';
import global from 'styles/Global.module.scss';
import Topbar from 'components/Topbar';
import Footer from 'components/Footer';
import axios from 'axios';
import { Tab, Col, Nav, Row} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { courses } from 'database/courses';
import Button from 'react-bootstrap/Button';

export default function CourseManagementPage({props}) {
    const [students, setStudents] = useState({
      "type":{
        "enrolled":[],
        "pending":[]
      }
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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
    function approveStudent(event){
      event.preventDefault();
      const _id = event.target.value;
      const url = "/api/teacher/approveStudent"
      const data = {
        "course_id": props.course_id,
        "student_id": _id
      };
      axios.post(url, data)
      .then(function (response) {
        
      })
      .catch(function (error) {
        setError(error.response.data.error);
        setIsLoading(false);
      });
    }
    function rejectStudent(event){
      event.preventDefault();
      const _id = event.target.value;
    }
    useEffect(() => {
      loadStudents();
    },[]);
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
                            students.type.pending.length ?
                              students.type.pending.map(function(student,index){
                                return (
                                  <li className="list-group-item" key={student._id}>
                                    <div className='row'>
                                      <span className='col-9'>
                                        {student.lastName}, {student.firstName}
                                      </span>
                                      <span className='col-3'>               
                                        <Button variant="primary" className="m-1" size="sm" data-index={index} value={student._id} onClick={approveStudent}>Approve</Button>
                                        <Button variant="danger" className="m-1" size="sm" data-index={index} value={student._id} onClick={rejectStudent}>Reject</Button>             
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
                        <h1>wakanda 2</h1>
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
      </>
    );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const course_id = Number(context.params.course_id);
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