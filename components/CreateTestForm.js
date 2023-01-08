import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { getTomorrowDate } from 'helpers/functions';
import Alert from 'react-bootstrap/Alert';

export default function CreateTestForm({course_id, onSuccessCallback}) {
    const [formData, setFormData] = useState({
      "course_id": course_id,
      "name":"",
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
        [name]: date.toISOString()
      });
    }
    const handleSubmit = function(event){
      event.preventDefault();
      const url = "/api/teacher/createTest";
      axios.post(url, formData)
      .then(function (response) {
        onSuccessCallback && onSuccessCallback();
      })
      .catch(function (error) {
        setError(error.response.data.error);
      });       
    }
    return(
          <Form onChange={handleChange} onSubmit={handleSubmit}>  
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="name" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <DatePicker
                  selected={ formData.startDate ? new Date(formData.startDate) : "" }
                  onChange={(date) => handleOnDateChange(date, "startDate") }
                  name="startDate"
                  showTimeSelect
                  timeFormat="HH:mm"
                  minDate={getTomorrowDate()}
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  autoComplete='off'
                  required
                  onKeyDown={(e) => {
                    e.preventDefault();
                 }}
            />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>deadline</Form.Label>
              <DatePicker
                  selected={ formData.deadline ? new Date(formData.deadline) : "" }
                  onChange={(date) => handleOnDateChange(date, "deadline") }
                  name="deadline"
                  showTimeSelect
                  timeFormat="HH:mm"
                  minDate={getTomorrowDate()}
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  autoComplete='off'
                  required
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
              />
            </Form.Group>
            { error && <Alert variant="danger"> {error} </Alert>}
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Form>    
    )
}