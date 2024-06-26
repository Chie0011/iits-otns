import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import TrackVisibility from "react-on-screen";
import { Container, Row, Col } from "react-bootstrap";
import Logo from "../../images/Logo.png"; //
import bug from "../../images/bug.svg"; // Adjust the path as per your directory structure

const EmailVerify = () => {
  //gradient color background registration
  useEffect(() => {
    document.body.classList.add("registration-page");

    return () => {
      document.body.classList.remove("registration-page");
    };
  }, []);

  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();

  //this is the email verification page
  //fetching the token and email from the url to verify its validity and authenticity
  useEffect(() => {
    const EmailVerifyUrl = async () => {
      try {
        const url = `https://otnsbackend.vercel.app/api/auth/users/${param.email}/verify/${param.token}`;
        const response = await axios.get(url);
        console.log(response.data.message);
        localStorage.removeItem("token");
        setValidUrl(true);
      } catch (err) {
        console.error(err.response.data);
        if (
          err.response.status === 401 ||
          err.response.status === 400 ||
          err.response.status === 500
        ) {
          // Token is expired or invalid
          setValidUrl(false);
        } else {
        }
      }
    };
    EmailVerifyUrl(); // Call the function to verify the email URL
  }, [param, setValidUrl]); // Add dependencies to re-run the effect when they change

  return (
    <>
      {validUrl ? (
        <section className="contact" id="connect">
          <Container>
            <Row className="align-items-center justify-content-center">
              <Col size={12} md={6} className="mx-3">
                <TrackVisibility>
                  {({ isVisible }) => (
                    <div
                      className={
                        isVisible ? "animate__animated animate__fadeIn" : ""
                      }
                    >
                      <div
                        className="img-containerr"
                        style={{ marginTop: "50px" }}
                      >
                        <img className="immg" src={Logo} alt="" />
                      </div>
                      <h1 className="company text-center">
                        INNOVATO INFORMATION TECHNOLOGY SOLUTIONS
                      </h1>
                      <div className="text-center">
                        <h2>Your email has been successfully verified!</h2>
                        <Col className="px-0 col-12">
                          <Link to="/login">
                            <button
                              className="green_btn"
                              style={{
                                marginTop: "20px",
                                backgroundColor: "#FF6C37",
                                border: "none",
                                color: "white",
                                padding: "10px 50px",
                                borderRadius: "5px",
                                textAlign: "center",
                                textDecoration: "none",
                                fontWeight: "700",
                                display: "inline-block",
                                fontSize: "16px",
                                fontStyle: "normal",
                                margin: "4px 2px",
                                cursor: "pointer",
                                fontFamily: "sans-serif",
                                width: "100%",
                              }}
                            >
                              Return to Sign In
                            </button>
                          </Link>
                        </Col>
                      </div>
                    </div>
                  )}
                </TrackVisibility>
              </Col>
            </Row>
          </Container>
        </section>
      ) : (
        <section className="contact" id="connect">
          <Container>
            <Row className="align-items-center justify-content-center">
              <Col size={12} md={6} className="mx-3">
                <TrackVisibility>
                  {({ isVisible }) => (
                    <div
                      className={
                        isVisible ? "animate__animated animate__fadeIn" : ""
                      }
                    >
                      <div
                        className="img-containerr"
                        style={{ marginTop: "30px" }}
                      >
                        <img className="immg" src={bug} alt="" />
                      </div>

                      <div className="text-center">
                        <h2>Failed to verify email!</h2>
                        <Col className="px-0 col-12">
                          <Link to="/login">
                            <button
                              className="green_btn"
                              style={{
                                marginTop: "20px",
                                backgroundColor: "#FF6C37",
                                border: "none",
                                color: "white",
                                padding: "10px 50px",
                                borderRadius: "5px",
                                textAlign: "center",
                                fontWeight: "100%",
                                textDecoration: "none",
                                display: "inline-block",
                                fontSize: "16px",
                                fontStyle: "normal",
                                margin: "4px 2px",
                                cursor: "pointer",
                                fontFamily: "sans-serif",
                                width: "100%",
                              }}
                            >
                              Return to Sign In
                            </button>
                          </Link>
                        </Col>
                      </div>
                    </div>
                  )}
                </TrackVisibility>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </>
  );
};

export default EmailVerify;
