import React, { Fragment, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

//This is connected to Admin Side, adding location to make it dynamic
const AddLocation = ({}) => {
  const [location, setLocation] = useState("");
  const [backdropOpen, setBackdropOpen] = useState(false);

  //edit description function

  const insertLocation = async (e) => {
    e.preventDefault();
    try {
      if (!location) {
        toast.error("Location is required ", { autoClose: 3000 });
        return;
      }

      setBackdropOpen(true); // S ow backdrop

      const body = { location };

      const response = await fetch(
        "https://otnsbackend.vercel.app/api/auth/admin/insert",
        {
          method: "POST",
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
      // Display error message if an error occurred during update
      toast.error("An error occurred while updating the form");
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <Fragment>
      <ToastContainer />
      <Button
        variant="primary"
        className="mr-2"
        data-toggle="modal"
        onClick={handleShowModal}
      >
        Add Location
      </Button>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>New Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="Location">
            <Form.Control
              as="textarea"
              rows="1"
              placeholder="Enter Location Here"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
              insertLocation(e);
              handleCloseModal();
            }}
          >
            Insert
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default AddLocation;
