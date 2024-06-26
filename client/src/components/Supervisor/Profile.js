import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";

import "../../App.css";

import TrackVisibility from "react-on-screen";

import { validateEmail } from "../../validation/emailValidation";
import { validatePassword } from "../../validation/passwordValidation";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Profile2 = ({ setAuth }) => {
  //gradient color background registration
  useEffect(() => {
    document.body.classList.add("registration-page");

    return () => {
      document.body.classList.remove("registration-page");
    };
  }, []);

  const [id, setID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [buttonText] = useState("Update Profile");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onChange = (fieldName, value) => {
    // Dynamically update state based on fieldName
    switch (fieldName) {
      case "email":
        setEmail(value);
        const emailError = validateEmail(value);
        setEmailError(emailError);
        break;
      case "password":
        setPassword(value);
        const passwordError = validatePassword(value);
        setPasswordError(passwordError);
        break;
      // Add more cases for other fields as needed
      default:
        break;
    }
  };

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

      if (res.ok) {
        const parseData = await res.json();
        setID(parseData.supervisor_id);
        setEmail(parseData.supervisor_email);
        setPassword(parseData.supervisor_password);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("emp");

        setAuth(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  }, [setAuth]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const [errorMessage] = useState("");
  const [msg] = useState();
  const [backdropOpen, setBackdropOpen] = useState(false);

  //submitting the updated infos of the supervisor
  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please fill in all fields.");
      return;
    }

    //try connecting to auth and post registration
    try {
      setBackdropOpen(true); // Show backdrop

      const body = {
        id,
        password,
        email,
      };

      const response = await fetch(
        "https://otnsbackend.vercel.app/api/auth/users/updateprofile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const parseRes = await response.json();

      if (parseRes.success) {
        toast.success("Profile was updated successfully");
      } else {
        toast.error(parseRes.error);
      }
    } catch (err) {
      console.error(err.message);
      // Handle network errors or unexpected errors
    } finally {
      setBackdropOpen(false);
    }
  };

  return (
    <section
      className="contact"
      id="connect"
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: "60px",
        justifyContent: "center",
      }}
    >
      <ToastContainer />
      <Container>
        <Row className="contactt align-items-center justify-content-center">
          <Col size={1} md={6} className="mx-3">
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <h2>Update Profile</h2>

                  <form onSubmit={onSubmitForm}>
                    <Row>
                      <Col size={12} sm={6} xl={12} className="px-1">
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => onChange("email", e.target.value)}
                        />
                        <p className="error-message">{emailError}</p>
                      </Col>
                      <Col size={12} sm={6} xl={12} className="px-1">
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => onChange("password", e.target.value)}
                        />
                        <p className="error-message">{passwordError}</p>
                      </Col>
                      <Col size={12} md={12} xl={!2} className="px-1">
                        <button
                          type="submit"
                          style={{
                            backgroundColor: emailError ? "#ff0000" : "",
                          }}
                          disabled={emailError}
                        >
                          <span>{buttonText}</span>
                        </button>

                        {msg && <p className="message">{msg}</p>}
                        {errorMessage && (
                          <p className="error-message ">{errorMessage}</p>
                        )}
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
  );
};

export default Profile2;
