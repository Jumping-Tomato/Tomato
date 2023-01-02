import { Button, Modal } from 'react-bootstrap';

export default function GeneralModal({show, title, message, closeModalCallBack}){
    return(
        <Modal show={show} onHide={closeModalCallBack}>
          <Modal.Header closeButton={true}>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {message}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={closeModalCallBack}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
    )
}