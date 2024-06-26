import React, { Fragment, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const EditUser = ({ user }) => {
  const [email, setEmail] = useState(user.emp_email);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  //updating email of user
  const updateDescription = async (e) => {
    e.preventDefault();
    setBackdropOpen(true); // Show backdrop

    try {
      const body = { email };
      const response = await fetch(
        `https://otnsbackend.vercel.app/api/auth/admin/${user.emp_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const parseRes = await response.json();
      if (response.ok) {
        window.location.reload();
      } else {
        toast.error(parseRes.error);
      }
    } catch (err) {
      console.error(err.message);
      toast.error("An error occurred while updating the email");
    } finally {
      setBackdropOpen(false); // Hide backdrop
    }
  };

  return (
    <Fragment>
      <ToastContainer />
      <Button
        variant="info"
        className="mr-2"
        data-toggle="modal"
        data-target={`#id${user.emp_id}`}
        onClick={handleShowModal}
      >
        Edit
      </Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="remarks">
            <Form.Label>Update</Form.Label>
            <Form.Control
              className="form-control"
              input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                borderRadius: "5px",
                marginTop: "10px",
                fontSize: "15px",
                letterSpacing: "2px",
              }}
            />
          </Form.Group>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdropOpen}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleCloseModal();
              setEmail(user.emp_email);
            }}
          >
            Close
          </Button>
          <Button
            variant="info"
            onClick={(e) => {
              updateDescription(e);
              handleCloseModal();
            }}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default EditUser;
