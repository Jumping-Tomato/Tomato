import Head from 'next/head'
import global from 'styles/Global.module.scss'
import Topbar from 'components/Topbar'
import Footer from 'components/Footer'
import { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useRouter } from 'next/router';
import {Alert, Button, Form, Col, Row, Spinner } from 'react-bootstrap';

export default function SearchCoursePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
      "teacherFirstName":"",
      "teacherLastName": "",
      "course":""
    });
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = function (event){
      let name = event.target.name;
      let val = event.target.value;
      setFormData({
        ...formData,
        [name]: val
      });
    }
    const handleSubmit = (event) => {
      event.preventDefault();
      const url = "/api/findCourses";
      setIsLoading(true)
      axios.post(url, formData)
      .then(function (response) {
        setCourses(response.data.courses);
        setIsLoading(false);
      })
      .catch(function (error) {
        setError(error.response.data.error);
        setIsLoading(false);
      }); 
    }
    const requestToJoin = (event) =>{
      const course_id = event.target.value;
      const data = {
        "course_id": course_id
      };
      const url = "/api/requestToJoin";
      axios.post(url, data)
      .then(function (response) {
        const new_courses = [...courses];
        const index = event.target.getAttribute("data-index");
        new_courses[index]["pending"] = true;
        setCourses(new_courses);
      })
      .catch(function (error) {
        setError(error.response.data.error);
        setIsLoading(false);
      });
    }
    return(
        <>
        <Topbar />
        <div className={global.container}>
          <Head>
            <title>Add Course Page</title>
            <meta name="description" content="student Add Course Page" />
            <link rel="icon" href="#" />
          </Head>
          
     
          <main className={global.main}>
            <div className='row justify-content-center'>
              <div className="col-lg-6 col-12 p-3">
                <Form onChange={handleChange} onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Teacher&#39;s First Name</Form.Label>
                                <Form.Control type="text" name="teacherFirstName" min="1" max="30" placeholder="Teacher&#39;s First Name" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Teacher&#39;s Last Name</Form.Label>
                                <Form.Control type="text" name="teacherLastName" min="1" max="30" placeholder="Teacher&#39;s Last Name" />
                            </Form.Group>
                        </Col>
                    </Row> 
                    <Form.Group className="mb-3">
                        <Form.Label>Course Name</Form.Label>
                        <Form.Control type="text" name="course" min="1" max="30" placeholder="Course&#39;s name" />
                    </Form.Group>
                  { error && <Alert variant="danger"> {error} </Alert>}
                  <Button variant="primary" type="submit">
                    Search
                  </Button>
                </Form>
                <div className="pt-3">
                  { 
                    isLoading ? 
                    <Spinner animation="border" />
                      :
                    <ul className="list-group">
                    {
                      courses.map((course, index) => {
                          return  (
                          <li className="list-group-item" key={course._id}>
                            <div className='row'>
                              <span className='col-4'>
                                {course.name}
                              </span>
                              <span className='col-4'>
                                {course.teacher_info[0].lastName}, {course.teacher_info[0].firstName}
                              </span>
                              <span className='col-4'>               
                                  {
                                    course.pending ? <Button variant="secondary" size="sm" data-index={index} disabled>Pending</Button>
                                    : course.joined ? <Button variant="secondary" size="sm" data-index={index} disabled>Joined</Button> 
                                    : <Button variant="danger" size="sm" value={course._id} data-index={index} onClick={requestToJoin}>Join</Button> 
                                  }
                              </span>
                            </div>      
                          </li>);
                      })
                    }
                    </ul>
                  }
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </>
    )
}