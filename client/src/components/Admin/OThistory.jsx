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
import DateTime from "datatables.net-datetime";
import "datatables.net-buttons";
import "datatables.net-responsive";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";

import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
// import "datatables.net-datetime/css/dataTables.dateTime.css";
import "datatables.net-buttons";
import "datatables.net-responsive";
import moment from "moment";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// import edit from "../../images/edit.svg";
import { toast, ToastContainer } from "react-toastify";
import EditInfo2 from "../EditInfo2";
export const OThistory3 = () => {
  useEffect(() => {
    document.body.classList.add("registration-page");

    return () => {
      document.body.classList.remove("registration-page");
    };
  }, []);

  const [request, setRequest] = useState([]);
  const [approve, setApprove] = useState([]);
  const [reject, setReject] = useState([]);
  const [admin, setEmail] = useState([]);
  const [backdropOpen, setBackdropOpen] = useState(false);

  const setMail = admin;

  //fetching admin profile
  const getProfile = async () => {
    try {
      const res = await fetch(
        "https://otnsbackend.vercel.app/api/auth/admin/",
        {
          method: "GET",
          headers: { jwt_token: localStorage.token },
        }
      );

      if (res.ok) {
        const parseData = await res.json();

        setEmail(parseData.admin_email);
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

  //approving an OT request
  const handleApprove = async (id, email, date) => {
    try {
      setBackdropOpen(true); // Show backdrop

      const response = await fetch(
        `https://otnsbackend.vercel.app/api/auth/supervisor/request/${id}/${email}/${date}`,
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

  //fetching total Pending request
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

  //fetching All Approved request
  const getApprove = async () => {
    try {
      const response = await fetch(
        "https://otnsbackend.vercel.app/api/auth/supervisor/allapproved"
      );

      const jsonData = await response.json();
      console.log(jsonData);

      setApprove(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getApprove();
  }, []);
  console.log(request);

  //fetching All Rejected request

  const getReject = async () => {
    try {
      const res = await fetch(
        "https://otnsbackend.vercel.app/api/auth/supervisor/allrejected/",
        {
          method: "GET",
          headers: { jwt_token: localStorage.token },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const parseData = await res.json();
      setReject(parseData); // Set the received data in the state
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getReject();
  }, []);

  useEffect(() => {
    let minDate, maxDate;

    // Custom filtering function which will search data in column four between two values
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
      let min = minDate.val();
      let max = maxDate.val();
      let date = new Date(data[6]); // Assuming date is in the 7th column (0-indexed)

      if (
        (min === null && max === null) ||
        (min === null && date <= max) ||
        (min <= date && max === null) ||
        (min <= date && date <= max)
      ) {
        return true;
      }
      return false;
    });

    // Create date inputs
    minDate = new DateTime("#min", {
      format: "MMMM Do YYYY",
      theme: "dark", // Set the theme to 'dark'
    });
    maxDate = new DateTime("#max", {
      format: "MMMM Do YYYY",
      theme: "dark", // Set the theme to 'dark'
    });

    const initializeDataTable = () => {
      // Initialize DataTable only when data is available
      if (request.length > 0 && !$.fn.DataTable.isDataTable("#example")) {
        const table = $("#example").DataTable({
          dom: "Bfrtip", // Add buttons to the DataTable
          buttons: ["excel"], // Specify buttons to include
          scrollX: true, // Enable horizontal scrolling
          columnDefs: [
            { targets: 12, width: "100px" }, // Adjust width of remarks column
          ],
        });

        // Refilter the table when the date range changes
        $("#min, #max").on("change", function () {
          table.draw();
        });

        return table; // Return the DataTable instance
      }
    };

    const table = initializeDataTable();

    return () => {
      // Destroy the DataTable instance when component unmounts
      if (table) {
        table.destroy();
        $.fn.dataTable.ext.search.pop(); // Remove the custom search function
      }
    };
  }, [request]); // Re-initialize DataTable whenever request data changes

  useEffect(() => {
    let minDate, maxDate;

    // Custom filtering function which will search data in column four between two values
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
      let min1 = minDate.val();
      let max1 = maxDate.val();
      let date = new Date(data[2]); // Assuming date is in the 7th column (0-indexed)
      if (
        (min1 === null && max1 === null) ||
        (min1 === null && date <= max1) ||
        (min1 <= date && max1 === null) ||
        (min1 <= date && date <= max1)
      ) {
        return true;
      }
      return false;
    });

    // Create date inputs
    minDate = new DateTime("#min1", {
      format: "MMMM Do YYYY",
      theme: "dark", // Set the theme to 'dark'
    });
    maxDate = new DateTime("#max1", {
      format: "MMMM Do YYYY",
      theme: "dark", // Set the theme to 'dark'
    });

    const initializDataTable = () => {
      // Initialize DataTable only when data is available
      if (approve.length > 0 && !$.fn.DataTable.isDataTable("#example2")) {
        const table = $("#example2").DataTable({
          dom: "Bfrtip", // Add buttons to the DataTable
          buttons: ["excel"], // Specify buttons to include
          scrollX: true, // Enable horizontal scrolling
          columnDefs: [
            { targets: 9, width: "100px" }, // Adjust width of remarks column
          ],
        });

        // Refilter the table when the date range changes
        $("#min1, #max1").on("change", function () {
          table.draw();
        });

        return table; // Return the DataTable instance
      }
    };

    const table = initializDataTable();

    return () => {
      // Destroy the DataTable instance when component unmounts
      if (table) {
        table.destroy();
        $.fn.dataTable.ext.search.pop(); // Remove the custom search function
      }
    };
  }, [approve]); // Re-initialize DataTable whenever approve data changes

  useEffect(() => {
    let minDate, maxDate;

    // Custom filtering function which will search data in column four between two values
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
      let min2 = minDate.val();
      let max2 = maxDate.val();
      let date = new Date(data[2]); // Assuming date is in the 7th column (0-indexed)
      if (
        (min2 === null && max2 === null) ||
        (min2 === null && date <= max2) ||
        (min2 <= date && max2 === null) ||
        (min2 <= date && date <= max2)
      ) {
        return true;
      }
      return false;
    });

    // Create date inputs
    minDate = new DateTime("#min2", {
      format: "MMMM Do YYYY",
      theme: "dark", // Set the theme to 'dark'
    });
    maxDate = new DateTime("#max2", {
      format: "MMMM Do YYYY",
      theme: "dark", // Set the theme to 'dark'
    });

    const initialDataTable = () => {
      // Initialize DataTable only when data is available
      if (reject.length > 0 && !$.fn.DataTable.isDataTable("#rejected")) {
        const table = $("#rejected").DataTable({
          dom: "Bfrtip", // Add buttons to the DataTable
          buttons: ["excel"], // Specify buttons to include
          scrollX: true, // Enable horizontal scrolling
          columnDefs: [
            { targets: 9, width: "100px" }, // Adjust width of remarks column
          ],
        });

        // Refilter the table when the date range changes
        $("#min2, #max2").on("change", function () {
          table.draw();
        });

        return table; // Return the DataTable instance
      }
    };

    const table = initialDataTable();

    return () => {
      // Destroy the DataTable instance when component unmounts
      if (table) {
        table.destroy();
        $.fn.dataTable.ext.search.pop(); // Remove the custom search function
      }
    };
  }, [reject]); // Re-initialize DataTable whenever approve data changes

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

  //Function where admin can only approve pending request coming from Paranaque
  const isAuthorizedUser = (email) => {
    const authorizedEmails = [
      "dave.giron@innovatotec.com",
      "anjie.boton@innovatotec.com",
    ];
    return authorizedEmails.includes(email);
  };

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
          {/* <table border="0" cellspacing="5" cellpadding="5">
            <tbody>
              <tr>
                <td>Time To:</td>
                <td>
                  <input type="text" id="min" name="min"></input>
                </td>
              </tr>
              <tr>
                <td>Time From:</td>
                <td>
                  <input type="text" id="max" name="max"></input>
                </td>
              </tr>
            </tbody>
          </table> */}
          <div>
            <label htmlFor="min" style={{ fontWeight: "700" }}>
              Date From:
            </label>
            <input type="text" id="min" style={{ marginLeft: "10px" }} />
            <br></br>
            <label htmlFor="max" style={{ fontWeight: "700" }}>
              Date To:
            </label>
            <input
              type="text"
              id="max"
              style={{ marginLeft: "32px", marginBottom: "20px" }}
            />
          </div>
          <table id="example" className="table table-striped  nowrap bg-dark ">
            <thead>
              <tr className="justify-content-center">
                <th style={{ color: "aqua" }}>Timestamp</th>
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
                  <td>
                    {moment(ot_request.req_timestamp).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </td>
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
                  </td>{" "}
                  <td>
                    <button className="btn btn-warning">
                      {" "}
                      {ot_request.req_status}
                    </button>
                  </td>
                  <td>
                    <div className="">
                      {isAuthorizedUser(ot_request.req_email) && (
                        <>
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
                            <EditInfo2
                              ot_request={ot_request}
                              setMail={setMail}
                            />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={backdropOpen}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <hr style={{ margin: "50px 20px" }} />
        </Container>
      </div>
      <div className="history-container">
        <Container className="history align-items-center" id="approved">
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
                    <span className="tagline">OT Approved Request</span>
                  </div>
                )}
              </TrackVisibility>
            </Col>
          </Row>
          <div>
            <label htmlFor="min" style={{ fontWeight: "700" }}>
              Date From:
            </label>
            <input type="text" id="min" style={{ marginLeft: "10px" }} />
            <br></br>
            <label htmlFor="max" style={{ fontWeight: "700" }}>
              Date To:
            </label>
            <input
              type="text"
              id="max"
              style={{ marginLeft: "32px", marginBottom: "20px" }}
            />
          </div>
          <table
            id="example2"
            className="table table-striped  nowrap bg-dark "
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="justify-content-center">
                <th style={{ color: "aqua" }}>Timestamp</th>
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
                <th style={{ color: "aqua" }}>Remarks</th>
                <th style={{ color: "aqua" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {/* Render table rows based on request data */}
              {approve.map((ot_request, index) => (
                <tr key={ot_request.req_id}>
                  <td>
                    {moment(ot_request.req_timestamp).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </td>
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
                  </td>{" "}
                  <td>
                    <button className="btn btn-primary">
                      {" "}
                      {ot_request.req_status}
                    </button>
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
                  <td>
                    <button
                      className="btn btn-success mr-2"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to approve this?"
                          )
                        ) {
                          handleApprove(ot_request.req_id);
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
        </Container>
      </div>
      <div className="history-container">
        <Container className="history align-items-center" id="reject">
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
                    <span className="tagline">OT Rejected Request</span>
                  </div>
                )}
              </TrackVisibility>
            </Col>
          </Row>
          <div>
            <label htmlFor="min" style={{ fontWeight: "700" }}>
              Date From:
            </label>
            <input type="text" id="min" style={{ marginLeft: "10px" }} />
            <br></br>
            <label htmlFor="max" style={{ fontWeight: "700" }}>
              Date To:
            </label>
            <input
              type="text"
              id="max"
              style={{ marginLeft: "32px", marginBottom: "20px" }}
            />
          </div>
          <table
            id="rejected"
            className="table table-striped  nowrap bg-dark "
            style={{ width: "100%" }}
          >
            <thead>
              <tr className="justify-content-center">
                <th style={{ color: "aqua" }}>Timestmap</th>
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
                <th style={{ color: "aqua" }}>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {/* Render table rows based on request data */}
              {reject.map((ot_request, index) => (
                <tr key={ot_request.req_id}>
                  <td>
                    {moment(ot_request.req_timestamp).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </td>
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
                  </td>{" "}
                  <td>
                    <button className="btn btn-danger">
                      {" "}
                      {ot_request.req_status}
                    </button>
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
                  </td>{" "}
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

export default OThistory3;
