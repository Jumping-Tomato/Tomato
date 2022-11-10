import {Button, Card, Form, Row, Col} from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

export default function QuestionCard({props,title,handleRemoveButtonClick,updateQuestion}) {
    var choices = props.multipleChoice.choices;
    function addChoice(event){
        event.preventDefault();
        const num_of_choices = Object.keys(choices).length;
        if(num_of_choices < 5){
            let new_props = {...props};
            let new_choice = String.fromCharCode(94 + 3 + num_of_choices);
            new_props.multipleChoice.choices[new_choice] = "";
            updateQuestion(new_props);
        } 
    }
    function removeChoice(event){
        const choice = event.currentTarget.value;
        let new_props = {...props};
        delete new_props.multipleChoice.choices[choice];
        updateQuestion(new_props);
    }
    function handleChange(event){
        const inputName = event.target.getAttribute("data-input-name");
        let value = event.target.value;
        const new_props = JSON.parse(JSON.stringify(props));
        if (inputName == "questionType"){
            new_props.type = value;
            updateQuestion(new_props);
        }
        else if(inputName == "choice"){
            const choice = event.target.getAttribute("data-choice");
            new_props.multipleChoice.choices[choice] = value;
            updateQuestion(new_props);
        }
        else{
            const questionType = props.type;
            new_props[questionType][inputName] = value;
            updateQuestion(new_props);
        }
        
    }
    return (
        <Card className="p-0">
            <Card.Header>
                {title}
                <button type="button" className="btn btn-sm btn-danger rounded-circle float-end" 
                    style={{padding:"0 4px",
                            transform: "translate(20px, -15px)"
                    }}
                    onClick={handleRemoveButtonClick}
                    >
                    <FontAwesomeIcon icon={faMinus} size="xs" />
                </button>
            </Card.Header>
            <Card.Body> 
                <Form onChange={handleChange}>
                    <Form.Group className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Select name="type" data-input-name="questionType" required>
                            <option value="multipleChoice">Multiple Choice</option>
                            <option value="shortAnswer">Short Answer</option>
                        </Form.Select>
                    </Form.Group>
                    {
                        props.type == "multipleChoice"
                        ?
                        <>
                            <Form.Group className="mb-3" >
                                <Form.Label>Question:</Form.Label>
                                <Form.Control as="textarea" data-input-name="question" name="question" row={3} value={props.multipleChoice.question} />
                            </Form.Group>
                            {
                                Object.entries(choices).map(([key, value], index)=>{
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
                                                    index > 0 && index == Object.keys(choices).length - 1 &&
                                                    <button type="button" className="btn btn-sm btn-danger" value={key} onClick={removeChoice}>
                                                        <FontAwesomeIcon icon={faMinus} size="sm" />&nbsp; 
                                                    </button>
                                                }                                               
                                            </Col>
                                        </Form.Group>
                                        )
                                    })
                            }
                            <Form.Group className="mb-3">
                                <Form.Label>Correct Answer</Form.Label>
                                <Form.Select data-input-name="correct_answer" required>
                                    {
                                        Object.keys(choices).map((key)=>{
                                            return <option value={key} key={key}>{key.toUpperCase()}</option>
                                        })     
                                    }
                                </Form.Select>
                            </Form.Group>
                        </>
                        :
                        <>
                            <Form.Group className="mb-3" >
                                <Form.Label>Question:</Form.Label>
                                <Form.Control as="textarea" data-input-name="question" row={3} value={props.shortAnswer.question} />
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label>Correct Answer:</Form.Label>
                                <Form.Control as="textarea" data-input-name="correct_answer" row={3} value={props.shortAnswer.correct_answer} />
                            </Form.Group>
                        </>
                            
                    }
                </Form>   
            </Card.Body>
        </Card>
    )
}