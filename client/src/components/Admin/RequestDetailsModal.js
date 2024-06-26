import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function RequestDetailsModal({ ot_request, setMail }) {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  function formatReqId(reqId) {
    // Convert reqId to string
    let formattedId = reqId.toString();
    // Calculate the length of the formatted ID
    const idLength = formattedId.length;
    // Determine the number of leading zeros to add
    const zerosToAdd = 5 - idLength;
    // Add leading zeros
    for (let i = 0; i < zerosToAdd; i++) {
      formattedId = "0" + formattedId;
    }
    // Add prefix 'OTR-' and return the formatted ID
    return "OTR-" + formattedId;
  }

  return (
    <>
      <Button onClick={handleShowModal}>View</Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title align-content-center justify-content-center">
            Innovato Overtime Form Approval
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <p className="mb-3">
            You have been requested to review the following:
          </p>
          <p className="mb-2">
            Overtime Request #: {formatReqId(ot_request.req_id)}
          </p>
          <p className="mb-2">Email Address: {ot_request.req_email}</p>
          <p className="mb-2">Name: {ot_request.req_name}</p>
          <p className="mb-2">Current Schedule: {ot_request.req_shift}</p>
          <p className="mb-2">
            Date: {new Date(ot_request.req_date).toLocaleDateString()}
          </p>
          <p className="mb-2">Time From: {ot_request.req_timefrom}</p>

          <p className="mb-2">Time To: {ot_request.req_timeto}</p>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "5px",
              marginBottom: "10px",
            }}
          >
            <p className="">
              Reason For Overtime:
              <textarea
                rows="3"
                value={ot_request.req_reason}
                onChange={(e) => {
                  // If you want to allow editing, handle onChange event
                  // For read-only, you don't need onChange
                }}
                style={{
                  width: "100%", // Adjust width as needed, you can use pixels or percentages
                  minWidth: "300px", // Adjust minimum height as needed
                  minHeight: "80px", // Adjust minimum height as needed
                  resize: "none", // Prevent resizing if necessary
                  border: "none",
                  padding: "5px",
                  borderRadius: "5px", // Optional: add border radius for appearance
                }}
                readOnly // Make it read-only
              />
            </p>
          </div>

          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <p>
              Approval History:{" "}
              <button
                className={`btn ${
                  ot_request.req_status === `Rejected by ${setMail}`
                    ? "btn-danger"
                    : ot_request.req_status === "Pending"
                    ? "btn-warning"
                    : "btn-primary"
                } p-1`}
              >
                {ot_request.req_status}
              </button>
            </p>
            <p className="mb-2 mt-2">
              Remarks:{" "}
              <textarea
                rows="3"
                value={ot_request.req_remarks}
                onChange={(e) => {
                  // If you want to allow editing, handle onChange event
                  // For read-only, you don't need onChange
                }}
                style={{
                  padding: "10px",
                  width: "100%", // Adjust width as needed, you can use pixels or percentages
                  minWidth: "300px", // Adjust minimum height as needed
                  minHeight: "80px", // Adjust minimum height as needed
                  resize: "none", // Prevent resizing if necessary
                  border: "none",
                  borderRadius: "5px", // Optional: add border radius for appearance
                }}
                readOnly // Make it read-only
              />
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RequestDetailsModal;
