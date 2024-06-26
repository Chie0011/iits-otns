import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import { validatePassword } from "../validation/passwordValidation";
import TrackVisibility from "react-on-screen";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../images/Logo.png"; // Adjust the path as per your directory structure
import bug from "../images/bug.svg"; // Adjust the path as per your directory structure
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

//reset password form UI frontend
const ResetPasswordForm = ({ email, token }) => {
  //gradient color background registration
  useEffect(() => {
    document.body.classList.add("registration-page");

    return () => {
      document.body.classList.remove("registration-page");
    };
  }, []);

  const [buttonText] = useState("Submit");
  const [btnText] = useState("Sign in");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setError] = "";

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const onChange = (fieldName, value) => {
    // Dynamically update state based on fieldName
    switch (fieldName) {
      case "password":
        setPassword(value);
        const passwordError = validatePassword(value);
        setPasswordError(passwordError);
        break;
      case "confirmpass":
        setConfirmPassword(value);
        const confirmError = validatePassword(value);
        setConfirmError(confirmError);
        break;
      default:
        break;
    }
  };

  const [errorMessage] = useState("");
  const [validUrl, setValidUrl] = useState(null);
  const [validUrl2, setValidUrl2] = useState(true);
  const [formSubmitted] = useState(false); // Add a state to track form submission
  const [backdropOpen, setBackdropOpen] = useState(false);

  const param = useParams();

  //handle reset password submission
  const onSubmitForm = useCallback(
    async (e) => {
      if (e) {
        e.preventDefault(); // Prevent form submission
      }

      try {
        setBackdropOpen(true); // Show backdrop

        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        const response = await axios.post(
          `https://otnsbackend.vercel.app/api/auth/forgot/reset/${param.email}/${param.token}`,
          {
            password,
          }
        );

        console.log(response.data);

        // Check if response was successful
        if (response.status >= 200 && response.status < 300) {
          setValidUrl(true);
          setValidUrl2(false);
        } else {
          // Handle unsuccessful response
          console.error("Unsuccessful response:", response);
          setValidUrl(false);
          setValidUrl2(false);
          if (response.data && response.data.error) {
            setError(response.data.error);
          } else {
            setError("An error occurred");
          }
          setValidUrl(false);
          setValidUrl2(false);
        }
      } catch (err) {
        console.error(err.response.data);
        setError(err.response.data.error || "An error occurred");
      } finally {
        setBackdropOpen(false); // Hide backdrop
      }
    },
    [password, confirmPassword, param.email, param.token]
  );

  //fetching the provided token and email from the url present to verify its validity and authenticity
  useEffect(() => {
    // Check if the form has been submitted before calling onSubmitForm
    if (formSubmitted) {
      onSubmitForm();
    }
  }, [formSubmitted, onSubmitForm]); // Add formSubmitted to dependency array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://otnsbackend.vercel.app/api/auth/forgot/reset/${param.email}/${param.token}`;
        await axios.get(url);
        // No error, reset error state
        setError(null);
      } catch (err) {
        // Error handling for network or server errors
        console.error(err.response.data);
        if (
          err.response.status === 401 ||
          err.response.status === 400 ||
          err.response.status === 500
        ) {
          // Token is expired or invalid
          setValidUrl(false);
          setValidUrl2(false);
        } else {
          setError(err.response.data.error || "An error occurred");
        }
      }
    };

    fetchData(); // Call the fetchData function
  }, [param.email, param.token]);

  return (
    <>
      {validUrl2 ? (
        <div>
          <ToastContainer />
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
                            Please create a new password.
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
                              <label htmlFor="password">New Password:</label>
                              <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) =>
                                  onChange("password", e.target.value)
                                }
                                required
                              />
                              <p className="error-message">{passwordError}</p>
                            </Col>
                            <Col
                              size={12}
                              sm={6}
                              xl={12}
                              className="px-1 pb-1 pb-sm-0 mx-0 mx-sm-0"
                            >
                              <label htmlFor="confirmPassword">
                                Confirm Password:
                              </label>
                              <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) =>
                                  onChange("confirmpass", e.target.value)
                                }
                                required
                              />
                              <p className="error-message">{confirmError}</p>
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
                                  backgroundColor:
                                    passwordError || confirmError
                                      ? "#ff0000"
                                      : "",
                                }}
                                className="btn-lg"
                                disabled={passwordError || confirmError}
                              >
                                <span>{buttonText}</span>
                              </button>
                              {errorMessage && (
                                <p className="message">{errorMessage}</p>
                              )}
                            </Col>
                            <Col
                              // size={12}
                              // sm={6}
                              className="px-0 pb-1 pb-sm-0 mx-0 mx-sm-0 col-12"
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
        </div>
      ) : null}
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
                        style={{ marginTop: "30px" }}
                      >
                        <img className="immg" src={Logo} alt="" />
                      </div>
                      <h1 className="company text-center">
                        INNOVATO INFORMATION TECHNOLOGY SOLUTIONS
                      </h1>
                      <div className="text-center">
                        <h2>Your password has been successfully reset!</h2>
                        <h5 className="reset">
                          Sign in with your new password
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
                                display: "inline-block",
                                fontWeight: "700",
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
      ) : null}
      {validUrl === false && (
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
                        <h2>Failed to reset password!</h2>
                        <h5 className="reset">
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

export default ResetPasswordForm;
