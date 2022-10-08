import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import Topbar from 'components/Topbar'
import Footer from 'components/Footer'
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function createPage() {
    const [formData, setFormData] = useState({
      "type":"",
      "name":"",
      "startDate": "",
      "deadline":""
    });
    const handleChange = function (event){
      let name = event.target.name;
      let val = event.target.value;
      setFormData({
        ...formData,
        [name]: val
      });
    }
    const [dates, setDates] = useState({
      "startDate":"",
      "deadline":""
    });
    const handleOnDateChange = (date, name) => {
      setDates({
        ...dates,
        [name]: date
      });
    }
    const [error, setError] = useState("");
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
                <Form onChange={handleChange}>  
                  <Form.Group className="mb-3">
                      <Form.Label>Type</Form.Label>
                      <Form.Select name="type" required>
                          <option disbled></option>
                          <option value="Quiz">Quiz</option>
                      </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" placeholder="name" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker
                        selected={ dates.startDate }
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
                        selected={ dates.deadline }
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