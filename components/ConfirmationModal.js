import { Alert, Button, Modal } from 'react-bootstrap';

export default function ConfirmationModal({show, title, message, error, confirmationCallBack ,closeModalCallBack}){
    return(
        <Modal show={show} onHide={closeModalCallBack}>
          <Modal.Header closeButton={true}>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {message}
          </Modal.Body>
          { error && <Alert variant="danger"> {error} </Alert>}
          <Modal.Footer>
            <Button variant="success" onClick={confirmationCallBack}>
              Yes
            </Button>
            <Button variant="danger" onClick={closeModalCallBack}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
    )
}