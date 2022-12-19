import { Form } from 'react-bootstrap';

export default function TestQuestion({question, handleChange}) {
  return (
        <>
            <h4>{question.detail.question}</h4>   
                <Form onChange={handleChange}>
                    {
                        question.type == "multipleChoice" ?
                        <Form.Group className="mb-3">
                            <Form.Label>
                                { question.hasMultipleCorrectAnswers ? "select the correct answers (More than one correct answer)" : "select the correct answer"}
                            </Form.Label>
                            {
                                Object.entries(question.detail.choices).map(([key, value])=>{
                                return <Form.Check
                                            name="answer"
                                            key={key}
                                            type={question.hasMultipleCorrectAnswers ? "checkbox": "radio"}
                                            label={`${key}: ${value}`}
                                            value={value}
                                        />
                                })
                            }
                        </Form.Group>
                        :
                        <Form.Group className="mb-3">
                            <Form.Label>Type your answer below: </Form.Label>
                            <Form.Control name="answer" type="text" />
                        </Form.Group>
                    }
                </Form>     
        </>           
    );
};