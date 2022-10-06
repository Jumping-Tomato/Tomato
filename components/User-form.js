import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default function UserForm({handleChange, handleSubmit, formFields, error}) {
    return (
        <Form onChange={handleChange}  onSubmit={handleSubmit} >  
            {
                formFields.map(function(form) {
                    return (
                        <Form.Group className="mb-3" key={ form["label"] }>
                            <Form.Label>{ form["label"] }</Form.Label>
                            <Form.Control type={ form["type"] } name={ form["name"] } placeholder={ form["placeholder"] }  required={ form["required"] } />
                        </Form.Group>
                    ) 
                })
            }
            { error && <Alert variant="danger"> {error} </Alert>}
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}