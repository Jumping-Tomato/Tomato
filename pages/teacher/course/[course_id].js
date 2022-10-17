import Head from 'next/head';
import global from 'styles/Global.module.scss';
import Topbar from 'components/Topbar';
import Footer from 'components/Footer';
import { useRouter } from "next/router";
import { Tab, Col, Nav, Row} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { courses } from 'database/courses';

export default function CourseManagementPage({props}) {
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [pendingStudents, setPendingStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      
    });
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
              <Tab.Container defaultActiveKey="student">
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
  let userProps = {
    teacher_id: uid
  };
  return {
    props: {userProps}
  }
}