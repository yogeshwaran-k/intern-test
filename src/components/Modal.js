import { Modal, Button } from 'react-bootstrap';

function CustomModal({ show, title, message, onClose, confirmButton = false, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        {confirmButton ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              No
            </Button>
            <Button variant="primary" onClick={onConfirm}>
              Yes
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={onClose}>
            OK
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;