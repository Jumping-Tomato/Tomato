import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default function UserForm({handleChange, handleSubmit, formFields, error}) {
    var formArray = [];
    for (let i = 0; i < formFields.length; i++){
        let data = formFields[i];
        formArray.push(
            <Form.Group className="mb-3">
                <Form.Label>{ data["label"]} </Form.Label>
                <Form.Control type={ data["type"] } name={ data["name"] } placeholder={ data["placeholder"] }  required={ data["required"] } />
            </Form.Group>
        )
    }
    return (
        <Form onChange={handleChange}  onSubmit={handleSubmit} > 
            { formArray }
            { error && <Alert variant="danger"> {error} </Alert>}
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}