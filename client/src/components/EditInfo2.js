import React, { Fragment, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const EditTodo = ({ ot_request, setMail }) => {
  const [remarks, setRemarks] = useState("");
  const [backdropOpen, setBackdropOpen] = useState(false);

  //edit description of remarks when rejecting form

  const updateDescription = async (e) => {
    e.preventDefault();
    try {
      setBackdropOpen(true); // Show backdrop

      const body = { remarks };

      const response = await fetch(
        `https://otnsbackend.vercel.app/api/auth/supervisor/${ot_request.req_id}`,
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
        toast.error("Failed to update form");
      }
    } catch (err) {
      console.error(err.message);
      // Display error message if an error occurred during update
      toast.error("An error occurred while updating the form");
    } finally {
      setBackdropOpen(false);
    }
  };

  const handleReject = async (id, email, date) => {
    try {
      const response = await fetch(
        `https://otnsbackend.vercel.app/api/auth/supervisor/reject/${id}/${email}/${date}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Rejected", setMail }), // Set the status to "APPROVED"
        }
      );
      const data = await response.json();
      if (response.ok) {
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <Fragment>
      <ToastContainer />
      <Button
        variant="danger"
        className="mr-2"
        data-toggle="modal"
        data-target={`#id${ot_request.req_id}`}
        onClick={handleShowModal}
      >
        Reject
      </Button>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Remarks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="remarks">
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              as="textarea"
              rows="5"
              placeholder="Enter Remarks Here"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              style={{
                borderRadius: "5px",
                marginTop: "10px",
                fontSize: "15px",
              }}
            />
          </Form.Group>
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={backdropOpen}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="info"
            onClick={(e) => {
              updateDescription(e);
              handleReject(
                ot_request.req_id,
                ot_request.req_email,
                ot_request.req_date
              );
              handleCloseModal();
            }}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default EditTodo;
