import React, { useEffect, useState, useCallback } from "react";
import TrackVisibility from "react-on-screen";
import { Container, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";

const Dashboard = ({ setAuth }) => {
  useEffect(() => {
    document.body.classList.add("registration-page");

    return () => {
      document.body.classList.remove("registration-page");
    };
  }, []);

  const [name, setName] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  //fetching supervisor infos
  const getProfile = useCallback(async () => {
    try {
      const res = await fetch(
        "https://otnsbackend.vercel.app/api/auth/supervisor/",
        {
          method: "GET",
          headers: { jwt_token: localStorage.token },
        }
      );
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("emp_role");

      if (token && storedRole) {
        // Decode the token to get the role
        const decodedToken = jwtDecode(token);
        const role2 = decodedToken.supervisor.role;

        // Check if the stored role matches the role from the token
        if (storedRole !== role2) {
          // If the roles don't match, log the user out
          localStorage.removeItem("token");
          localStorage.removeItem("emp_role");
          setAuth(false);
        }
      }
      const parseData = await res.json();
      setName(parseData.supervisor_email);
      // setName(parseData.req_date);
    } catch (err) {
      console.error(err.message);
    }
  }, [setAuth]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  //fetching total count request
  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const res = await fetch(
          "https://otnsbackend.vercel.app/api/auth/supervisor/count/",
          {
            method: "GET",
            headers: { jwt_token: localStorage.token },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const { totalCount, pendingCount, approvedCount, rejectedCount } =
          await res.json();

        // Set counts
        setTotalCount(totalCount);
        setPendingCount(pendingCount);
        setApprovedCount(approvedCount);
        setRejectedCount(rejectedCount);
      } catch (err) {
        console.error(err.message);
        toast.error("Failed to fetch request data");
      }
    };

    fetchRequestData();
  }, []);

  const [users, setUsers] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  //Initializing arrays of data per month and year

  const getMonthYearFormat = (monthName) => {
    const monthIndex = months.indexOf(monthName) + 1; // Adding 1 because months are zero-indexed
    const monthString = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
    return `${selectedYear}-${monthString}`;
  };
  getMonthYearFormat(months); // Returns "2024-05"

  useEffect(() => {
    // Fetch users and their total requests per month from the backend
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `https://otnsbackend.vercel.app/api/auth/admin/users?year=${selectedYear}`
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [selectedYear]);

  const yearString = new Date().getFullYear();

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const years = Array.from(
    { length: yearString - 2000 },
    (_, index) => yearString - index
  );

  return (
    <section className="banner " id="home">
      <ToastContainer />
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col xs={12} md={6} xl={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <span className="tagline">
                    Welcome to OT Notification System
                  </span>
                  <h1>
                    Hi{" "}
                    <div
                      className=""
                      style={{ marginTop: "-45px", marginLeft: "50px" }}
                    >
                      <span className="taglinee">{name} </span>
                    </div>
                  </h1>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row className="align-items-center justify-content-center">
          <Col xs={12} md={6} xl={12}>
            <div className="main-title">
              <h3>DASHBOARD</h3>
            </div>

            <div className="main-cards">
              <div className="card">
                <div className="card-inner">
                  <h3>TOTAL OT</h3>

                  <BsFillArchiveFill className="card_icon" />
                </div>
                <h1
                  className=""
                  style={{
                    color: "#295ac6",
                    // Add any additional styles here
                  }}
                >
                  {totalCount}
                </h1>
              </div>
              <div className="card">
                <div className="card-inner">
                  <h3>PENDING</h3>
                  <BsFillGrid3X3GapFill className="card_icon" />
                </div>
                <h1
                  className=""
                  style={{
                    color: "#e7ac0a",
                    // Add any additional styles here
                  }}
                >
                  {pendingCount}
                </h1>
              </div>
              <div className="card">
                <div className="card-inner">
                  <h3>APPROVED</h3>
                  <BsPeopleFill className="card_icon" />
                </div>
                <h1
                  className=""
                  style={{
                    color: "#0eb145",
                    // Add any additional styles here
                  }}
                >
                  {approvedCount}
                </h1>
              </div>
              <div className="card">
                <div className="card-inner">
                  <h3>REJECTED</h3>
                  <BsFillBellFill className="card_icon" />
                </div>
                <h1
                  className=""
                  style={{
                    color: "#d50000",
                    // Add any additional styles here
                  }}
                >
                  {rejectedCount}
                </h1>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col xs={12} md={6} xl={12}>
            {" "}
            <div className="apptech">
              <h3>AppTech Users</h3>
              <div className="" style={{ marginTop: "100px" }}>
                <select value={selectedYear} onChange={handleYearChange}>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="location">
              <div className="row">
                <div className="col">
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="bg-dark">
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Shift</th>
                          <th>Location</th>
                          <th>Phone</th>
                          {/* Render columns for each month */}
                          {months.map((month) => (
                            <th key={month}>{month}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user.emp_id}>
                            <td>{index + 1}</td>
                            <td>{user.emp_name}</td>
                            <td>{user.emp_email}</td>
                            <td>{user.emp_shift}</td>
                            <td>{user.emp_location}</td>
                            <td>{user.emp_phone}</td>
                            {months.map((month) => (
                              <td key={month}>
                                {user.requests_per_month.find(
                                  (entry) =>
                                    entry.month_year ===
                                    getMonthYearFormat(month)
                                )?.total_requests || 0}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Dashboard;
