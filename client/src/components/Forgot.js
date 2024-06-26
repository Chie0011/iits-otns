import React, { useState, useEffect } from "react";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import Logo from "../images/Logo.png"; // Adjust the path as per your directory structure
import { validateEmail } from "../validation/emailValidation";

import TrackVisibility from "react-on-screen";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Forgot = ({ setAuth }) => {
  //gradient color background registration
  useEffect(() => {
    document.body.classList.add("registration-page");

    return () => {
      document.body.classList.remove("registration-page");
    };
  }, []);

  const [email, setEmail] = useState("");

  const [buttonText] = useState("Submit");
  const [btnText] = useState("Sign in");

  const [emailError, setEmailError] = useState("");
  const [backdropOpen, setBackdropOpen] = useState(false);

  const onChange = (fieldName, value) => {
    // Dynamically update state based on fieldName
    switch (fieldName) {
      case "email":
        setEmail(value);
        const emailError = validateEmail(value);
        setEmailError(emailError);
        break;

      // Add more cases for other fields as needed
      default:
        break;
    }
  };

  const [errorMessage] = useState("");

  const [validUrl2, setValidUrl2] = useState(true);

  //submitting the email address for sending the reset token link
  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Form validation (you can add more validation as needed)
    if (!email) {
      toast.error("Please fill in all fields");
      return;
    }

    //try connecting to auth and post registration
    try {
      setBackdropOpen(true); // Show backdrop

      const body = { email };

      const response = await fetch(
        "https://otnsbackend.vercel.app/api/auth/forgot/reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const parseRes = await response.json();

      if (response.ok) {
        const { email } = parseRes;
        console.log("Email:", email);
        setValidUrl2(false);
      } else {
        console.error("Error:", parseRes.error);
        toast.error(parseRes.error);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setBackdropOpen(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {validUrl2 ? (
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
                      <div className="img-containerr">
                        <img className="immg" src={Logo} alt="" />
                      </div>
                      <h1 className="company text-center">
                        INNOVATO INFORMATION TECHNOLOGY SOLUTIONS
                      </h1>
                      <div className="text-center">
                        <h2>Reset your password</h2>
                        <h5 className="reset">
                          Please enter your email address and we'll send you a
                          link to reset your password.
                        </h5>
                      </div>

                      <form onSubmit={onSubmitForm}>
                        <Row>
                          <Col
                            size={12}
                            sm={6}
                            xl={12}
                            className="px-1 pb-1 pb-sm-0 mx-0 mx-sm-0"
                          >
                            <input
                              type="email"
                              placeholder="Email Address"
                              value={email}
                              onChange={(e) =>
                                onChange("email", e.target.value)
                              }
                            />
                            <p className="error-message">{emailError}</p>
                          </Col>

                          <Col
                            // size={12}
                            // sm={6}
                            // xl={7}
                            className="px-1 pb-1 pb-sm-0 mx-0 mx-sm-0 col-12"
                          >
                            <button
                              type="submit"
                              style={{
                                backgroundColor: emailError ? "#ff0000" : "",
                              }}
                              disabled={emailError}
                            >
                              <span>{buttonText}</span>
                            </button>
                            {errorMessage && (
                              <p className="message">{errorMessage}</p>
                            )}
                          </Col>
                          <Col
                            size={12}
                            sm={6}
                            className="px-1 pb-1 pb-sm-0 mx-0 mx-sm-0"
                          >
                            <h6>
                              Back to Login?
                              {/* <div className="Link" id="supervisor"> */}
                              <Link to="/login">
                                <span>{btnText}</span>
                              </Link>
                              {/* </div> */}
                            </h6>
                          </Col>
                        </Row>
                      </form>
                      <Backdrop
                        sx={{
                          color: "#fff",
                          zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                        open={backdropOpen}
                      >
                        <CircularProgress color="inherit" />
                      </Backdrop>
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
                      <div className="img-containerr">
                        <img className="immg" src={Logo} alt="" />
                      </div>
                      <h1 className="company text-center">
                        INNOVATO INFORMATION TECHNOLOGY SOLUTIONS
                      </h1>
                      <div className="text-center">
                        <h2>Email Sent</h2>
                        <h5 className="reset">
                          A link to reset your password has been sent to you on{" "}
                          <div className="" style={{ fontWeight: "bold" }}>
                            {email}
                          </div>
                        </h5>
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
                                fontWeight: "100%",
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

export default Forgot;
