import React, { useEffect, useState, useCallback } from "react";
import TrackVisibility from "react-on-screen";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import {} from "react-router-dom";

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

  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  //fetching total count per user
  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const res = await fetch(
          "https://otnsbackend.vercel.app/api/request/count/",
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

  const [name, setName] = useState("");

  //fetching user information using headers
  const getProfile = useCallback(async () => {
    try {
      const res = await fetch("https://otnsbackend.vercel.app/api/dashboard/", {
        method: "GET",
        headers: { jwt_token: localStorage.token },
      });
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("emp_role");

      if (token && storedRole) {
        // Decode the token to get the role
        const decodedToken = jwtDecode(token);
        const role = decodedToken.emp.role;

        // Check if the stored role matches the role from the token
        if (storedRole !== role) {
          // If the roles don't match, log the user out
          localStorage.removeItem("token");
          localStorage.removeItem("emp_role");
          setAuth(false);
        }
      }
      const parseData = await res.json();
      setName(parseData.emp_name);
      // setName(parseData.req_date);
    } catch (err) {
      console.error(err.message);
    }
  }, [setAuth]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

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
                    Hi
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
          <Col>
            <div className="main-title">
              <h3>DASHBOARD</h3>
            </div>

            <div className="main-cards">
              <div className="card">
                <div className="card-inner">
                  <h3>TOTAL REQUEST</h3>

                  <BsFillArchiveFill className="card_icon" />
                </div>
                <h1
                  className="TOTAL"
                  style={{
                    color: "#295ac6",
                    // Add any additional styles here
                  }}
                >
                  {totalCount}
                </h1>
                <div className="class4">more info</div>
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
                <Nav.Link href="#approved" className="class2">
                  more info
                </Nav.Link>
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
                <Nav.Link href="#approved" className="class">
                  more info
                </Nav.Link>
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
                <Nav.Link href="#approved" className="class3">
                  more info
                </Nav.Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Dashboard;
