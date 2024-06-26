import React, { Fragment, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

//This is connected to Admin Side, adding Shift to make it dynamic
const AddShift = () => {
  const [location, setLocation] = useState("");
  const [backdropOpen, setBackdropOpen] = useState(false);

  //edit description function

  const insertShift = async (e) => {
    e.preventDefault();
    try {
      if ((!shiftName, !shiftTimes)) {
        toast.error("All field is required ", { autoClose: 3000 });
        return;
      }

      setBackdropOpen(true); // S ow backdrop

      const response = await fetch(
        "https://otnsbackend.vercel.app/api/auth/admin/shifts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shift_name: shiftName,
            shift_times: shiftTimes,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        window.location.reload();
        console.log("Shift added successfully:", data);
      }
      // Optionally, update state or show a success message
      else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error adding shift:", error);
      // Handle error state or show an error message
    }
  };

  const [showModal, setShowModal] = useState(false);

  const [shiftName, setShiftName] = useState("");
  const [shiftTimes, setShiftTimes] = useState([]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShiftNameChange = (e) => setShiftName(e.target.value);
  const handleShiftTimesChange = (e) =>
    setShiftTimes(e.target.value.split(","));

  return (
    <Fragment>
      <ToastContainer />
      <Button
        variant="primary"
        className="mr-2"
        data-toggle="modal"
        onClick={handleShowModal}
      >
        Add Shift
      </Button>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>New Shift and Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="ShiftName">
            <Form.Label>Shift Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Shift Name"
              value={shiftName}
              onChange={handleShiftNameChange}
              style={{
                borderRadius: "5px",
                marginBottom: "10px",
                fontSize: "15px",
              }}
            />
          </Form.Group>
          <Form.Group controlId="ShiftTimes">
            <Form.Label>Shift Time (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Shift Time"
              value={shiftTimes.join(",")}
              onChange={handleShiftTimesChange}
              style={{
                borderRadius: "5px",
                marginTop: "",
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
              insertShift(e);
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

export default AddShift;
