import React, { useState, useEffect } from "react";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import Logo from "../images/Logo.png"; // Adjust the path as per your directory structure
import { validateEmail } from "../validation/emailValidation";
import { validatePassword } from "../validation/passwordValidation";
import TrackVisibility from "react-on-screen";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Login = ({ setAuth }) => {
  // Apply gradient background on mount
  useEffect(() => {
    document.body.classList.add("registration-page");
    return () => {
      document.body.classList.remove("registration-page");
    };
  }, []);

  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [validUrl2, setValidUrl2] = useState(true);

  // Handle input changes
  const onChange = (fieldName, value) => {
    if (fieldName === "email") {
      setEmail(value);
      setEmailError(validateEmail(value));
    } else if (fieldName === "password") {
      setPassword(value);
      setPasswordError(validatePassword(value));
    }
  };

  // Handle login form submission
  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setBackdropOpen(true);
      const body = { email, password };
      const response = await fetch(
        "https://otnsbackend.vercel.app/api/auth/emp/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const parseRes = await response.json();

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const role = decodedToken.emp?.role || null;

          localStorage.setItem("emp", role);
          setAuth(true, role);
        }
      } else if (response.status === 200) {
        setValidUrl2(false);
      } else {
        setAuth(false, "");
        toast.error(parseRes.error, { autoClose: 3000 });
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
                        <img className="immg" src={Logo} alt="Company Logo" />
                      </div>
                      <h1 className="company text-center">
                        INNOVATO INFORMATION TECHNOLOGY SOLUTIONS
                      </h1>
                      <div className="text-center">
                        <h2>Sign in to Innovato</h2>
                      </div>
                      <form onSubmit={onSubmitForm}>
                        <Row>
                          <Col
                            size={12}
                            sm={6}
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
                            size={12}
                            sm={6}
                            className="px-1 pb-1 pb-sm-0 mx-0 mx-sm-0"
                          >
                            <input
                              type="password"
                              placeholder="Password"
                              value={password}
                              onChange={(e) =>
                                onChange("password", e.target.value)
                              }
                            />
                            <p className="error-message">{passwordError}</p>
                          </Col>
                          <Col className="px-1 pb-1 pb-sm-0 mx-0 mx-sm-0 col-12">
                            <button
                              type="submit"
                              className="btn-lg"
                              disabled={emailError || passwordError}
                            >
                              <span>Sign in</span>
                            </button>
                          </Col>
                          <Col className="px-0 pb-1 pb-sm-0 mx-0 mx-sm-0 col-12">
                            <div className="password" id="supervisor">
                              <Link to="/forgot-password">
                                <span className="spanText">
                                  Forgot Password
                                </span>
                              </Link>
                            </div>
                          </Col>
                          <Col
                            size={12}
                            sm={6}
                            className="px-1 pb-1 pb-sm-0 mx-0 mx-sm-0"
                          >
                            <h6>
                              Don't have an account?
                              <Link to="/register">
                                <span>Sign up</span>
                              </Link>
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
                        <img className="immg" src={Logo} alt="Company Logo" />
                      </div>
                      <h1 className="company text-center">
                        INNOVATO INFORMATION TECHNOLOGY SOLUTIONS
                      </h1>
                      <div className="text-center">
                        <h2>Email Verification Link Sent</h2>
                        <h5 className="reset">
                          An email has been sent to your account{" "}
                          <div className="bold">{email}</div>. Please verify it
                          to continue with your login.
                        </h5>
                        <Col className="px-0 col-12">
                          <Link to="/login" onClick={() => setValidUrl2(true)}>
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
                                fontWeight: "100%",
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

export default Login;
