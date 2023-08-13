import { Alert, Modal } from 'react-bootstrap';

export default function ErrorModal({show, title, message,closeButton, closeModalCallBack}){
    return(
        <Modal show={show} onHide={closeModalCallBack}>
          <Modal.Header closeButton={closeButton}>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="danger"> {message} </Alert>
          </Modal.Body>
        </Modal>
    )
}