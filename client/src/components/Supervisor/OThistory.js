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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { toast, ToastContainer } from "react-toastify";

import EditInfo2 from "../EditInfo2";

export const OThistory2 = () => {
  useEffect(() => {
    document.body.classList.add("registration-page");

    return () => {
      document.body.classList.remove("registration-page");
    };
  }, []);

  const [request, setRequest] = useState([]);
  const [email, setEmail] = useState([]);
  const setMail = email;
  const [backdropOpen, setBackdropOpen] = useState(false);

  //fetching information of supervisor
  const getProfile = async () => {
    try {
      const res = await fetch(
        "https://otnsbackend.vercel.app/api/auth/supervisor/",
        {
          method: "GET",
          headers: { jwt_token: localStorage.token },
        }
      );

      if (res.ok) {
        const parseData = await res.json();

        setEmail(parseData.supervisor_email);
        console.log("email:", setEmail);

        // setShift(parseData.emp_shift);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("emp");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  //Approving OT pending request
  const handleApprove = async (id, email, date) => {
    try {
      setBackdropOpen(true); // Show backdrop

      const response = await fetch(
        `https://otnsbackend.vercel.app/api/auth/supervisor/request/${id}/${email}/${date}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Approved", setMail }), // Set the status to "APPROVED"
        }
      );
      const data = await response.json();
      if (response.ok) {
        window.location.reload();
        getRequest(); // Refresh the request data after approval
      } else {
        toast.error(data.message || "Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    } finally {
      setBackdropOpen(false);
    }
  };

  //fetching all total pending request
  const getRequest = async () => {
    try {
      const response = await fetch(
        "https://otnsbackend.vercel.app/api/auth/supervisor/totalpending"
      );

      const jsonData = await response.json();
      console.log(jsonData);

      setRequest(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getRequest();
  }, []);

  console.log(request);

  useEffect(() => {
    const initializeDataTable = () => {
      // Initialize DataTable only when data is available
      if (request.length > 0 && !$.fn.DataTable.isDataTable("#example")) {
        const table = $("#example").DataTable({
          dom: "Bfrtip", // Add buttons to the DataTable
          buttons: ["copy", "csv", "excel", "pdf", "print"], // Specify buttons to include
          scrollX: true, // Enable horizontal scrolling
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
        <Container className="history align-items-center" id="pending">
          <ToastContainer />
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
          <table id="example" className="table table-striped  nowrap bg-dark ">
            <thead>
              <tr className="justify-content-center">
                <th style={{ color: "aqua" }}>No</th>
                <th style={{ color: "aqua" }}>Name</th>
                <th style={{ color: "aqua" }}>Email</th>
                <th style={{ color: "aqua" }}>Shift</th>
                <th style={{ color: "aqua" }}>Location</th>
                <th style={{ color: "aqua" }}>Date</th>
                <th style={{ color: "aqua" }}>Time To</th>
                <th style={{ color: "aqua" }}>Time From</th>
                <th style={{ color: "aqua" }}>Duration</th>
                <th style={{ color: "aqua" }}>Requested By</th>
                <th style={{ color: "aqua" }}>Department</th>
                <th style={{ color: "aqua" }}>Reason</th>
                <th style={{ color: "aqua" }}>Status</th>
                <th style={{ color: "aqua" }}>Action</th>
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
                  <td>{ot_request.req_timeto}</td>
                  <td>{ot_request.req_timefrom}</td>
                  <td>{ot_request.req_duration}</td>
                  <td>{ot_request.req_by}</td>
                  <td>{ot_request.req_department}</td>
                  <td>{ot_request.req_reason}</td>
                  <td>
                    <button className="btn btn-warning">
                      {" "}
                      {ot_request.req_status}
                    </button>
                  </td>

                  <td>
                    <button
                      className="btn btn-success mr-2"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to approve this?"
                          )
                        ) {
                          handleApprove(
                            ot_request.req_id,
                            ot_request.req_email,
                            ot_request.req_date
                          );
                        }
                      }}
                    >
                      Approve
                    </button>
                    <button>
                      <EditInfo2 ot_request={ot_request} setMail={setMail} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr style={{ margin: "50px 20px" }} />
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={backdropOpen}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Container>
      </div>
    </div>
  );
};

export default OThistory2;
