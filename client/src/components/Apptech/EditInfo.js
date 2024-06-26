import React, { Fragment, useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { parseISO, format } from "date-fns";
import { Modal, Button, Form } from "react-bootstrap";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const EditTodo = ({ ot_request }) => {
  const formattedDate = format(parseISO(ot_request.req_date), "yyyy-MM-dd");

  const [date, setDate] = useState(formattedDate);

  const [timeto, setTimeto] = useState(ot_request.req_timeto);
  const [timefrom, setTimefrom] = useState(ot_request.req_timefrom);
  const [duration, setDuration] = useState(ot_request.req_duration);
  const [by, setBy] = useState(ot_request.req_by);
  const [department, setDepartment] = useState(ot_request.req_department);
  const [reason, setReason] = useState(ot_request.req_reason);
  const [backdropOpen, setBackdropOpen] = useState(false);

  //calculated duration

  // Function to convert time string to Date object
  const parseTime = (timeString) => {
    // Split timeString into hours, minutes, and AM/PM parts
    const [time, period] = timeString.split(" ");
    const [hourStr, minuteStr] = time.split(":");

    // Convert hours and minutes to numbers
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Adjust hours for PM if necessary
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date;
  };

  // Calculate duration function
  const calculateDuration = useCallback((timeFromString, timeToString) => {
    const timeFrom = parseTime(timeFromString);
    const timeTo = parseTime(timeToString);

    const durationInMs = Math.abs(timeTo - timeFrom);
    const durationInHours = Math.floor(durationInMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
      (durationInMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${durationInHours} hours and ${remainingMinutes} minutes`;
  }, []);

  useEffect(() => {
    if (timefrom && timeto) {
      const newDuration = calculateDuration(timefrom, timeto);
      setDuration(newDuration);
    }
  }, [timefrom, timeto, calculateDuration]);

  //Updating form submitted by user
  const updateDescription = async (e) => {
    e.preventDefault();
    try {
      setBackdropOpen(true); // Show backdrop

      const body = {
        date,
        timeto,
        timefrom,
        duration,
        by,
        department,
        reason,
      };

      const response = await fetch(
        `https://otnsbackend.vercel.app/api/request/${ot_request.req_id}`,
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
      setBackdropOpen(false); // Hide backdrop
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  //department dropdown values
  const departmentOptions = [
    { value: "", label: "Department", disabled: true },
    { value: "MIS", label: "MIS" },
    { value: "HR & ADMIN DEPARTMENT", label: "HR & ADMIN DEPARTMENT" },
    { value: "DEVELOPMENT UNIT", label: "DEVELOPMENT UNIT" },
    { value: "OGM", label: "OGM" },
  ];
  //generating 24 hour format for time to and time from
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date();
        time.setHours(hour);
        time.setMinutes(minute);
        options.push({
          value: time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          label: time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    }
    return options;
  };
  const timeOptions = generateTimeOptions(); // Ensure timeOptions is correctly defined

  return (
    <Fragment>
      <ToastContainer />
      <Button
        variant="info"
        className="mr-2"
        data-toggle="modal"
        data-target={`#id${ot_request.req_id}`}
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
          <Modal.Title>Edit Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="remarks">
            <Form.Label>Update</Form.Label>
            <Form.Control
              input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                borderRadius: "5px",
                marginTop: "10px",
                fontSize: "15px",
                letterSpacing: "2px",
              }}
            />
            <Form.Control
              as="select"
              value={timefrom}
              onChange={(e) => setTimefrom(e.target.value)}
              style={{
                borderRadius: "5px",
                marginTop: "10px",
                fontSize: "15px",
                letterSpacing: "2px",
              }}
            >
              {timeOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
            <Form.Control
              as="select"
              value={timeto}
              onChange={(e) => setTimeto(e.target.value)}
              style={{
                borderRadius: "5px",
                marginTop: "10px",
                fontSize: "15px",
                letterSpacing: "2px",
              }}
            >
              {timeOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
            <Form.Control
              className="form-control"
              input
              type="text"
              value={duration}
              disabled
              onChange={(e) => setDuration(e.target.value)}
              style={{
                borderRadius: "5px",
                marginTop: "10px",
                fontSize: "15px",
                letterSpacing: "2px",
              }}
            />
            <Form.Control
              input
              type="text"
              className="form-control"
              value={by}
              onChange={(e) => setBy(e.target.value)}
              disabled
              style={{
                borderRadius: "5px",
                marginTop: "10px",
                fontSize: "15px",
                letterSpacing: "2px",
              }}
            />
            <Form.Control
              as="select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                borderRadius: "5px",
                marginTop: "10px",
                fontSize: "15px",
                letterSpacing: "2px",
              }}
            >
              {departmentOptions.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </Form.Control>
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
          <Button
            variant="secondary"
            onClick={() => {
              handleCloseModal();
              setDate(format(parseISO(ot_request.req_date), "yyyy-MM-dd"));
              setTimeto(ot_request.req_timeto);
              setTimefrom(ot_request.req_timefrom);
              setDuration(ot_request.req_duration);
              setBy(ot_request.req_by);
              setDepartment(ot_request.req_department);
              setReason(ot_request.req_reason);
            }}
          >
            Close
          </Button>

          {/* <Button
            variant="info"
            data-dismiss="modal"
            onClick={(e) => updateDescription(e)}
          >
            Send
          </Button> */}

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

export default EditTodo;
