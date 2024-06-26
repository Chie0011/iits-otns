import React, { Fragment, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const EditShift = ({ shifts }) => {
  const [shiftName, setShiftName] = useState(shifts ? shifts.shift_name : "");
  const [shiftTimes, setShiftTimes] = useState(
    shifts ? shifts.shift_times : []
  );

  const [backdropOpen, setBackdropOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleShiftNameChange = (e) => setShiftName(e.target.value);
  const handleShiftTimesChange = (e) =>
    setShiftTimes(e.target.value.split(","));

  //Updating specific shift
  const updateDescription = async (e) => {
    e.preventDefault();
    setBackdropOpen(true); // Show backdrop

    try {
      const response = await fetch(
        `https://otnsbackend.vercel.app/api/auth/admin/shift/${shifts.shift_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shift_name: shiftName,
            shift_times: shiftTimes,
          }),
        }
      );

      const parseRes = await response.json();
      if (response.ok) {
        window.location.reload();
      } else {
        toast.error(parseRes.error);
        toast.error("Failed to update email");
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
        data-target={`#id${shifts.shift_id}`}
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
              value={shiftName}
              onChange={handleShiftNameChange}
              style={{
                borderRadius: "5px",
                fontSize: "15px",
                marginBottom: "10px",
                letterSpacing: "2px",
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
                fontSize: "15px",
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
              setShiftName(shifts.shift_name);
              setShiftTimes(shifts.shift_times);
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

export default EditShift;
