import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import Topbar from 'components/Topbar'
import Footer from 'components/Footer'
import { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';
import { getNextTwoSemesters } from "helpers/functions"

export default function CreateCoursePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
      "name":"",
      "semester": ""
    });
    const [error, setError] = useState("");
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
      const url = "/api/create-course";
      axios.post(url, formData)
      .then(function (response) {
        router.push("/teacher/dashboard");
      })
      .catch(function (error) {
        setError(error.response.data.error);
      }); 
    }
    return(
        <>
        <Topbar />
        <div className={global.container}>
          <Head>
            <title>Class Create Page</title>
            <meta name="description" content="Teacher Create Page" />
            <link rel="icon" href="#" />
          </Head>
          
     
          <main className={global.main}>
            <div className='row justify-content-center'>
              <div className="col-lg-6 col-12 p-3">
                <Form onChange={handleChange} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" min="1" max="30" placeholder="Name of The class" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Semester</Form.Label>
                    <Form.Select name="semester" required>
                        <option disbled="true"></option>
                        { 
                          getNextTwoSemesters().map((semester)=>{
                            return <option disbled={semester}>{semester}</option>
                          })
                        }
                    </Form.Select>
                  </Form.Group>
                  { error && <Alert variant="danger"> {error} </Alert>}
                  <Button variant="primary" type="submit">
                    Create
                  </Button>
                </Form>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </>
    )
}