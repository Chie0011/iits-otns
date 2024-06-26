import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

// import DataTable from "datatables.net-dt";
import "datatables.net-responsive-dt";
import TrackVisibility from "react-on-screen";
import $ from "jquery"; // Import jQuery here
import "datatables.net-buttons/js/dataTables.buttons"; // Import DataTables buttons extension
import "datatables.net-buttons/js/buttons.html5"; // Import HTML5 export button
import "datatables.net-buttons/js/buttons.print"; // Import print button
import "datatables.net-buttons/js/buttons.colVis"; // Import column visibility button

import EditInfo from "./EditInfo";

export const OThistory = () => {
  const [request, setRequest] = useState([]);

  //fetching pending request per user

  const getRequest = async () => {
    try {
      const res = await fetch("https://otnsbackend.vercel.app/api/request/", {
        method: "GET",
        headers: { jwt_token: localStorage.token },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const parseData = await res.json();
      setRequest(parseData); // Set the received data in the state
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getRequest();
  }, []);

  useEffect(() => {
    const initializeDataTable = () => {
      // Initialize DataTable only when data is available
      if (request.length > 0 && !$.fn.DataTable.isDataTable("#example")) {
        const table = $("#example").DataTable({
          // responsive: true,
          dom: "Bfrtip", // Add buttons to the DataTable
          // buttons: ["copy", "csv", "excel", "pdf", "print"], // Specify buttons to include
          buttons: ["excel"], // Specify buttons to include
          scrollX: true, // Enable horizontal scrolling
          scrollY: true, // Enable horizontal scrolling

          columnDefs: [
            { targets: 12, width: "100px" }, // Adjust width of remarks column
          ],
        });

        return table; // Return the DataTable instance
      }
    };

    const table = initializeDataTable();

    return () => {
      // Destroy the DataTable instance when component unmounts
      if (table) {
        table.destroy();
      }
    };
  }, [request]); // Re-initialize DataTable whenever request data changes

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
    <div className="main-container">
      <div className="history-container">
        <Container className="history align-items-center" id="status">
          <Row className="align-items-center justify-content-center">
            <Col xs={12} md={6} xl={12}>
              <TrackVisibility>
                {({ isVisible }) => (
                  <div
                    className={
                      isVisible ? "animate__animated animate__fadeIn" : ""
                    }
                  >
                    <span className="tagline">OT Pending Request</span>
                  </div>
                )}
              </TrackVisibility>
            </Col>
          </Row>
          <table
            id="example"
            className="table table-striped  nowrap bg-dark "
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="justify-content-center">
                <th style={{ color: "aqua" }}>No</th>
                <th style={{ color: "aqua" }}>Name</th>
                <th style={{ color: "aqua" }}>Email</th>
                <th style={{ color: "aqua" }}>Shift</th>
                <th style={{ color: "aqua" }}>Location</th>
                <th style={{ color: "aqua" }}>Date</th>
                <th style={{ color: "aqua" }}>Time From</th>
                <th style={{ color: "aqua" }}>Time To</th>
                <th style={{ color: "aqua" }}>Duration</th>
                <th style={{ color: "aqua" }}>Requested By</th>
                <th style={{ color: "aqua" }}>Department</th>
                <th style={{ color: "aqua" }}>Reason</th>
                <th style={{ color: "aqua" }}>Status</th>
                <th style={{ color: "aqua" }}>Action</th>
                <th style={{ color: "aqua" }}>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {/* Render table rows based on request data */}
              {request.map((ot_request, index) => (
                <tr key={ot_request.req_id}>
                  <td>{formatReqId(ot_request.req_id)}</td>
                  <td>{ot_request.req_name}</td>
                  <td>{ot_request.req_email}</td>
                  <td>{ot_request.req_shift}</td>
                  <td>{ot_request.req_location}</td>
                  <td>{new Date(ot_request.req_date).toLocaleDateString()}</td>
                  <td>{ot_request.req_timefrom}</td>
                  <td>{ot_request.req_timeto}</td>
                  <td>{ot_request.req_duration}</td>
                  <td>{ot_request.req_by}</td>
                  <td>{ot_request.req_department}</td>
                  <td>
                    <textarea
                      rows="3"
                      value={ot_request.req_reason}
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
                        border: "1px solid #ccc", // Optional: add border for appearance
                        borderRadius: "5px", // Optional: add border radius for appearance
                      }}
                      readOnly // Make it read-only
                    />
                  </td>

                  <td>
                    <button className="btn btn-warning">
                      {" "}
                      {ot_request.req_status}
                    </button>
                  </td>
                  <td>
                    <EditInfo ot_request={ot_request} />
                  </td>
                  <td>
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
                        border: "1px solid #ccc", // Optional: add border for appearance
                        borderRadius: "5px", // Optional: add border radius for appearance
                      }}
                      readOnly // Make it read-only
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr style={{ margin: "50px 20px" }} />
        </Container>
      </div>
    </div>
  );
};

export default OThistory;
