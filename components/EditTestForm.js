import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { getTomorrowDate } from 'helpers/functions';
import Alert from 'react-bootstrap/Alert';

export default function EditTestForm({test_data, onSuccessCallback}) {
    const [formData, setFormData] = useState(test_data);
    const [error, setError] = useState("");
    const handleChange = function (event){
      let name = event.target.name;
      let val = event.target.value;
      if(name == "shuffle"){
        val = !formData.shuffle
      }
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
      const url = "/api/teacher/editTestDetail";
      axios.put(url, formData)
      .then(function (response) {
        if(onSuccessCallback){
          onSuccessCallback(formData);
        }
      })
      .catch(function (error) {
        setError(error.response.data.error);
      });       
    }
    return(
          <Form onChange={handleChange} onSubmit={handleSubmit}>  
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="name" value={formData.name} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                name="shuffle"
                label="shuffle"
                checked={formData.shuffle} 
              />
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
            />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>deadline</Form.Label>
              <DatePicker
                  selected={ formData.deadline ? new Date(formData.deadline) : ""  }
                  onChange={(date) => handleOnDateChange(date, "deadline") }
                  name="deadline"
                  showTimeSelect
                  timeFormat="HH:mm"
                  minDate={getTomorrowDate()}
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  autoComplete='off'
              />
            </Form.Group>
            { error && <Alert variant="danger"> {error} </Alert>}
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>    
    )
}