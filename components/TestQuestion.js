import { Form } from 'react-bootstrap';

export default function TestQuestion({question}) {
  return (
        <>
            <h4>{question.detail.question}</h4>
            {
                question.type == "multipleChoice" ?
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            { question.hasMultipleCorrectAnswers ? "select the correct answers (More than one correct answer)" : "select the correct answer"}
                        </Form.Label>
                        {
                            Object.entries(question.detail.choices).map(([key, value])=>{
                            return <Form.Check
                                        key={key}
                                        type={question.hasMultipleCorrectAnswers ? "checkbox": "radio"}
                                        label={`${key}: ${value}`}
                                    />
                            })
                        }
                    </Form.Group>    
                    </Form> 
                    :
                    <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Type your answer below: </Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </Form>
            }
        </>           
    );
};