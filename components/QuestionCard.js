import {Button, Card, Form} from 'react-bootstrap';
import { useState } from 'react';

export default function QuestionCard({props}) {
    const [questionType, setQuestionType] = useState("multiple choice");
    const [mcq, setMcq] = useState({
        question:"",
        choice:{
            a:"",
            b:"",
            c:"",
            d:""
        },
        correct_choice:""
    });
    const [shorAnswer, setShortAnswer] = useState("");
    function toggleQuestionType (event){
        let value = event.target.value;
        setQuestionType(value);
    }
    return (
        <Card>
            <Card.Header>{props.title}</Card.Header>
            <Card.Body> 
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Select name="type" onChange={toggleQuestionType} required>
                            <option disbled></option>
                            <option value="multiple choice">Multiple Choice</option>
                            <option value="short answer">Short Answer</option>
                        </Form.Select>
                    </Form.Group>
                    {
                        questionType == "multiple choice" 
                        ?
                        <>
                            {/* multiple choice */}
                            <Form.Group className="mb-3">
                                <Form.Control as="textarea" row={3} />
                            </Form.Group>
                        </>
                        :
                        <>
                            <h1>short Answer placeholder</h1>
                        </>
                    }
                    
                    <Button variant="primary">Confirm</Button>&nbsp;
                    <Button variant="danger">Cancel</Button>  
                </Form>   
            </Card.Body>
        </Card>
    )
}