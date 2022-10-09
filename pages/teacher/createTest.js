import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import Topbar from 'components/Topbar'
import Footer from 'components/Footer'
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useRouter } from 'next/router';
import Alert from 'react-bootstrap/Alert';

export default function CreateTestPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
      "type":"",
      "name":"",
      "length": "",
      "startDate": "",
      "deadline":""
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
    const handleOnDateChange = (date, name) => {
      setFormData({
        ...formData,
        [name]: date
      });
    }
    const types = {
      quiz: "/api/create-quiz"
    }
    const handleSubmit = async function(event){
      event.preventDefault();
      const url = types[formData.type];
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
            <title>Teacher Create Page</title>
            <meta name="description" content="Teacher Create Page" />
            <link rel="icon" href="#" />
          </Head>
          
     
          <main className={global.main}>
            <div className='row justify-content-center'>
              <div className="col-lg-6 col-12 p-3">
                <Form onChange={handleChange} onSubmit={handleSubmit}>  
                  <Form.Group className="mb-3">
                      <Form.Label>Type</Form.Label>
                      <Form.Select name="type" required>
                          <option disbled="true"></option>
                          <option value="quiz">Quiz</option>
                      </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" placeholder="name" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Length (minutes)</Form.Label>
                    <Form.Control type="number" name="length" min="1" max="30" placeholder="length of the assignment, quiz, or exam" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker
                        selected={ formData.startDate }
                        onChange={(date) => handleOnDateChange(date, "startDate") }
                        name="startDate"
                        showTimeSelect
                        timeFormat="HH:mm"
                        minDate={new Date()}
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                  />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>deadline</Form.Label>
                    <DatePicker
                        selected={ formData.deadline }
                        onChange={(date) => handleOnDateChange(date, "deadline") }
                        name="deadline"
                        showTimeSelect
                        timeFormat="HH:mm"
                        minDate={new Date()}
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
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