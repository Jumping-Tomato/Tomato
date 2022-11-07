import {Button, Card, Form, Row, Col} from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

export default function QuestionCard({props}) {
    const [questionType, setQuestionType] = useState(props.type ? props.type : "multiple choice");
    const [mcq, setMcq] = useState(
        props.question ? props.question :
        {
            question:"",
            choices:{
                a:""
            },
            correct_choice:""
        }
    );
    const [shorAnswer, setShortAnswer] = useState("");
    function toggleQuestionType (event){
        let value = event.target.value;
        setQuestionType(value);
    }
    function addChoice(event){
        event.preventDefault();
        const num_of_choices = Object.keys(mcq.choices).length;
        if(num_of_choices < 5){
            let new_mcq = Object.assign({}, mcq);
            let new_choice = String.fromCharCode(94 + 3 + num_of_choices);
            new_mcq.choices[new_choice] = "";
            setMcq(new_mcq);
        } 
    }
    function removeChoice(event){
        const choice = event.currentTarget.value;
        let new_mcq = Object.assign({}, mcq);
        delete new_mcq.choices[choice];
        setMcq(new_mcq);
    }
    function handleChange(event){
        const inputName = event.target.getAttribute("data-input-name");
        let value = event.target.value;
        if(inputName == "question"){
            setMcq({...mcq, "question" : value});
        }
        else if(inputName == "choice"){
            let new_mcq = Object.assign({}, mcq);
            const choice = event.target.getAttribute("data-choice");
            new_mcq.choices[choice] = value;
            setMcq(new_mcq);
        }
    }
    return (
        <Card className="p-0">
            <Card.Header>
                {props.title}
                <button type="button" className="btn btn-sm btn-danger rounded-circle float-end" 
                    style={{padding:"0 4px",
                            transform: "translate(20px, -15px)"
                    }}>
                    <FontAwesomeIcon icon={faMinus} size="xs" />
                </button>
            </Card.Header>
            <Card.Body> 
                <Form onChange={handleChange}>
                    <Form.Group className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Select name="type" onChange={toggleQuestionType} required>
                            <option value="multiple choice">Multiple Choice</option>
                            <option value="short answer">Short Answer</option>
                        </Form.Select>
                    </Form.Group>
                    {/* multiple choice */}
                    <Form.Group className="mb-3" >
                        <Form.Label>Question:</Form.Label>
                        <Form.Control as="textarea" data-input-name="question" name="question" row={3} />
                    </Form.Group>
                    {
                        questionType == "multiple choice"
                        &&
                        Object.entries(mcq.choices).map(([key, value], index)=>{
                            return(
                                <Form.Group className="mb-3" as={Row} key={index}>
                                    <Col xs={1}>
                                        <Form.Label>
                                            <h4>{key.toUpperCase()}:</h4>
                                        </Form.Label>
                                    </Col>
                                    <Col xs={5}>
                                        <Form.Control data-input-name="choice" data-choice={key} type="text" value={value} required />
                                    </Col>
                                    <Col xs={5}>
                                        {
                                            !index &&
                                            <button type="button" className="btn btn-sm btn-primary" onClick={addChoice}>
                                                <FontAwesomeIcon icon={faPlus} size="sm" />&nbsp; 
                                            </button>
                                        }
                                        {
                                            index > 0 && index == Object.keys(mcq.choices).length - 1 &&
                                            <button type="button" className="btn btn-sm btn-danger" value={key} onClick={removeChoice}>
                                                <FontAwesomeIcon icon={faMinus} size="sm" />&nbsp; 
                                            </button>
                                        }                                               
                                    </Col>
                                </Form.Group>
                                )
                            })
                    }       
                    <br />
                    <Button variant="primary">Confirm</Button>&nbsp;
                    <Button variant="danger">Cancel</Button>  
                </Form>   
            </Card.Body>
        </Card>
    )
}