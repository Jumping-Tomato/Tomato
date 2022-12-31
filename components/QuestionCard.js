import { Card, Form, Row, Col} from 'react-bootstrap';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import Multiselect from 'multiselect-react-dropdown';
import { nanoid } from 'nanoid'

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
        delete new_props.multipleChoice.correct_answers[choice];
        updateQuestion(new_props);
    }
    function addShortAnswer(event){
        event.preventDefault();
        const num_of_correct_answers = props.shortAnswer.correct_answers.length;
        if(num_of_correct_answers < 5){
            let new_props = {...props};
            new_props.shortAnswer.correct_answers.push({key:nanoid(), answer:""});
            updateQuestion(new_props);
        } 
    }
    function removeShortAnswer(event){
        event.preventDefault();
        const index = event.currentTarget.value;
        let new_props = {...props};
        new_props.shortAnswer.correct_answers.splice(index,1);
        updateQuestion(new_props);
    }
    function updateCorrectChoices(selectedList, selectedItem){
        let new_props = {...props};
        if(new_props.multipleChoice.correct_answers[selectedItem.value]){
            delete new_props.multipleChoice.correct_answers[selectedItem.value];
        }
        else{
            new_props.multipleChoice.correct_answers[selectedItem.value] = {
                point: 1
            }
        }
        new_props.multipleChoice.correct_answers
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
        else if(props.type == "multipleChoice" && inputName == "choice"){
            const choice = event.target.getAttribute("data-choice");
            new_props.multipleChoice.choices[choice] = value;
            updateQuestion(new_props);
        }
        else if(props.type == "multipleChoice" && inputName == "point"){
            const choice = event.target.getAttribute("data-choice");
            new_props.multipleChoice.correct_answers[choice]["point"] = parseInt(value);
            updateQuestion(new_props);
        }
        else if(props.type == "shortAnswer" && inputName == "correct_answers"){
            const index = event.target.getAttribute("data-index");
            let field = event.target.getAttribute("data-field");
            value = field == "point" ? parseInt(value) : value;
            new_props.shortAnswer.correct_answers[index][field] = value;
            updateQuestion(new_props);
        }
        else{
            const questionType = props.type;
            new_props[questionType][inputName] = value;
            updateQuestion(new_props);
        } 
    }
    
    function validateNumber(event){
        const value = event.target.value;
        const charCode = event.charCode;
        const max = event.target.getAttribute("max");
        /*if the value of the field has more digits than the max value,
        * that means the value has exceeded the max value. So, the key
        * will not be inputted. If the key entered is not a digit, such
        * as '.' or '-', the key will not be inputted to avoid negative
        * number and float.
        */ 
        if (value.length >= max.length || charCode < 49 || charCode > 57){
            event.preventDefault();
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
                        <Form.Select name="type" data-input-name="questionType" defaultValue={props.type} required>
                            <option value="multipleChoice">Multiple Choice</option>
                            <option value="shortAnswer">Short Answer</option>
                        </Form.Select>
                    </Form.Group>
                    {
                        props.type == "multipleChoice"
                        ?
                        <Fragment key="multipleChoice">
                            <Form.Group className="mb-3" >
                                <Form.Label>Question:</Form.Label>
                                <Form.Control as="textarea" data-input-name="question" row={3} defaultValue={props.multipleChoice.question} />
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
                                                <Form.Control data-input-name="choice" data-choice={key} type="text" defaultValue={value} required />
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
                                <Form.Label>Correct Answers: </Form.Label>
                                <Multiselect 
                                    onSelect={updateCorrectChoices}
                                    onRemove={updateCorrectChoices}
                                    options={ 
                                        Object.keys(props.multipleChoice.choices).sort().map((key)=>{
                                            return {name: key.toUpperCase(), value: key};
                                        })
                                    }
                                    selectedValues={
                                        Object.keys(props.multipleChoice.correct_answers).sort().map((key, index)=> {
                                            return {name: key.toUpperCase(), value: key}
                                        })
                                    }
                                    displayValue="name"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label>
                                    <h4>Points</h4>
                                </Form.Label>
                                {
                                    Object.entries(props.multipleChoice.correct_answers).sort().map(([key, value], index)=>{
                                        return (
                                            <Row key={key}>
                                                <Col xs={1}>
                                                    <Form.Label>
                                                        <h4>{key.toUpperCase()}:</h4>
                                                    </Form.Label>
                                                </Col>
                                                <Col xs={5}>
                                                    <Form.Control type="number" data-input-name="point" data-choice={key} defaultValue={value.point} required />
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label>Time (seconds):</Form.Label>
                                <Form.Control data-input-name="time" type="number" min="1" max="9999" onKeyPress={validateNumber} defaultValue={props.multipleChoice.time} required />
                            </Form.Group>
                        </Fragment>
                        :
                        <Fragment key="shortAnswer">
                            <Form.Group className="mb-3" >
                                <Form.Label>Question:</Form.Label>
                                <Form.Control as="textarea" data-input-name="question" row={3} defaultValue={props.shortAnswer.question} />
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label>Correct Answers:</Form.Label>
                                {
                                    props.shortAnswer.correct_answers.map((each, index)=>{
                                        return (
                                                <Row key={each.key} className="mb-3">
                                                    <Col xs={6}>
                                                        <Form.Control as="textarea" data-input-name="correct_answers" data-field="answer" data-index={index} row={3} defaultValue={each.answer} />
                                                    </Col>
                                                    <Col xs={1}>
                                                        <Form.Label>Point:</Form.Label>
                                                    </Col>
                                                    <Col xs={3}>
                                                        <Form.Control type="number" data-input-name="correct_answers"  data-field="point" data-index={index} defaultValue={each.point} required />
                                                    </Col>
                                                    <Col xs={1}>
                                                        {
                                                            !index &&
                                                            <button type="button" className="btn btn-sm btn-primary" onClick={addShortAnswer}>
                                                                <FontAwesomeIcon icon={faPlus} size="sm" />&nbsp; 
                                                            </button>
                                                        }
                                                        {
                                                            index > 0 && index < 5 &&
                                                            <button type="button" className="btn btn-sm btn-danger" value={index} onClick={removeShortAnswer}>
                                                                <FontAwesomeIcon icon={faMinus} size="sm" />&nbsp; 
                                                            </button>
                                                        }
                                                    </Col>
                                                </Row>
                                            )
                                    })
                                }                        
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label>Time (seconds):</Form.Label>
                                <Form.Control data-input-name="time" type="number" min="1" max="9999" onKeyPress={enterber} defaultValue={props.shortAnswer.time} required />
                            </Form.Group>
                        </Fragment>
                            
                    }
                </Form>   
            </Card.Body>
        </Card>
    )
}