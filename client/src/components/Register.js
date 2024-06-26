import React, { Fragment, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../App.css";
import Logo from "../images/Logo.png"; // Adjust the path as per your directory structure
import axios from "axios";

import TrackVisibility from "react-on-screen";

import { validateUsername } from "../validation/userValidation";
import { validateEmail } from "../validation/emailValidation";
import { validatePassword } from "../validation/passwordValidation";
import { validatePhone } from "../validation/phoneValidation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Register = () => {
  //gradient color background registration
  useEffect(() => {
    document.body.classList.add("registration-page");

    return () => {
      document.body.classList.remove("registration-page");
    };
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [shift, setShift] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [backdropOpen, setBackdropOpen] = useState(false);

  // const clearForm = () => {
  //   setName("");
  //   setEmail("");
  //   setPhone("");
  //   setPassword("");
  //   setShift("");
  //   setLocation("");
  //   setNameError("");
  // };

  const [buttonText] = useState("Create Account");
  const [btnText] = useState("Sign in");
  const [selectedValue, setSelectedValue] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // const [shiftError, setShiftError] = useState("");

  const handleShiftChange = (e) => {
    const value = e.target.value;
    setShift(value);
    setTime("");

    const newSelectedValue = `${value} - ${time}`;
    setSelectedValue(newSelectedValue);
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setTime(value);

    const newSelectedValue = `${shift} - ${value}`;
    setSelectedValue(newSelectedValue);
  };

  const onChange = (fieldName, value) => {
    // Dynamically update state based on fieldName
    switch (fieldName) {
      case "name":
        setName(value);
        const nameError = validateUsername(value);
        setNameError(nameError);
        break;
      case "email":
        setEmail(value);
        const emailError = validateEmail(value);
        setEmailError(emailError);
        break;
      case "phone":
        setPhone(value);
        const phoneError = validatePhone(value);
        setPhoneError(phoneError);
        break;
      case "password":
        setPassword(value);
        const passwordError = validatePassword(value);
        setPasswordError(passwordError);
        break;

      case "location":
        setLocation(value);

        break;
      // Add more cases for other fields as needed
      default:
        break;
    }
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [msg] = useState();
  const [validUrl2, setValidUrl2] = useState(true);

  //handle register submission
  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !shift || !location || !phone) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setBackdropOpen(true); // Show backdrop

      const body = {
        name,
        email,
        password,
        shift: selectedValue,
        location,
        phone,
      };

      const response = await fetch(
        "https://otnsbackend.vercel.app/api/auth/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const parseRes = await response.json();

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        setValidUrl2(false);

        // toast.success("An email sent to your account please verify");
      } else {
        // If response status is not ok, handle the error
        setErrorMessage();
        toast.error(parseRes.error, { autoClose: 5000 }); // Auto close after 5 seconds
        // If response status is not ok, handle the error
      }
    } catch (err) {
      console.error(err.message);
      // Handle network errors or unexpected errors
    } finally {
      setBackdropOpen(false); // Hide backdrop
    }
  };

  const [locs, setLocs] = useState([]); // Initialize loc as an empty array

  //fetching dynamic location values
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          "https://otnsbackend.vercel.app/api/auth/admin/loc"
        );
        const jsonData = await response.json();
        console.log(jsonData);
        setLocs(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchLocation();
  }, []);

  //fetching dynamic shifts values
  const [shiftTime, setShifts] = useState([]);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get(
          "https://otnsbackend.vercel.app/api/auth/admin/shifts"
        );
        setShifts(response.data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    fetchShifts();
  }, []);

  return (
    <>
      <ToastContainer />
      {validUrl2 ? (
        <section className="contact" id="connect">
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
                      <h2>Create AppTech Account</h2>
                      <form onSubmit={onSubmitForm}>
                        <Row>
                          <Col size={12} md={6} className="px-1">
                            <input
                              type="text"
                              placeholder="Name"
                              value={name}
                              onChange={(e) => onChange("name", e.target.value)}
                            />
                            {nameError && (
                              <p className="error-message">{nameError}</p>
                            )}
                          </Col>
                          <Col size={12} sm={6} className="px-1">
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
                          <Col size={12} sm={6} className="px-1">
                            <input
                              type="tel"
                              placeholder="Phone No."
                              value={phone}
                              onChange={(e) =>
                                onChange("phone", e.target.value)
                              }
                            />
                            <p className="error-message">{phoneError}</p>
                          </Col>
                          <Col size={12} sm={6} className="px-1">
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
                          <Col size={12} sm={6} className="px-1">
                            <div>
                              <select
                                value={shift}
                                onChange={handleShiftChange}
                                className="form-control2"
                                required
                              >
                                <option value="" disabled>
                                  Select Shift
                                </option>
                                {shiftTime.map((shifts) => (
                                  <option
                                    key={shifts.shift_id}
                                    value={shifts.shift_name}
                                  >
                                    {shifts.shift_name}
                                  </option>
                                ))}
                              </select>
                              {shift && (
                                <div className="Date">
                                  <select
                                    value={time}
                                    onChange={handleTimeChange}
                                    className="form-control2"
                                    required
                                  >
                                    <option value="" disabled>
                                      Select Time
                                    </option>
                                    {shiftTime
                                      .find(
                                        (shifts) => shifts.shift_name === shift
                                      )
                                      .shift_times.map((timeOption, index) => (
                                        <option key={index} value={timeOption}>
                                          {timeOption}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col size={12} sm={6} className="px-1">
                            <select
                              type="text"
                              name="location"
                              value={location}
                              onChange={(e) =>
                                onChange("location", e.target.value)
                              }
                              className="form-control2"
                            >
                              <option value="" disabled>
                                Select Location
                              </option>
                              {locs.length > 0 &&
                                locs.map((location) => (
                                  <option
                                    key={location.loc_id}
                                    value={location.loc_name}
                                  >
                                    {location.loc_name}
                                  </option>
                                ))}
                            </select>
                          </Col>
                          <Col size={12} md={12} className="px-1">
                            <button
                              type="submit"
                              style={{
                                backgroundColor:
                                  nameError || phoneError ? "#ff0000" : "",
                              }}
                              className="btn-lg"
                              disabled={
                                nameError ||
                                emailError ||
                                phoneError ||
                                passwordError
                              }
                            >
                              <span>{buttonText}</span>
                            </button>
                            {msg && <p className="message">{msg}</p>}
                            {errorMessage && (
                              <p className="error-message ">{errorMessage}</p>
                            )}
                          </Col>
                          <Col size={12} sm={6} xl={7} className="px-1">
                            <h6>
                              Already have an account?
                              {/* <div className="Link"> */}
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
                        <h2>Email Verification Link Sent</h2>
                        <h5 className="reset">
                          An email has been sent to your account{" "}
                          <div className="" style={{ fontWeight: "bold" }}>
                            {email}
                          </div>
                          . Please verify it to continue with your login.
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
                                fontWeight: "100%",
                                borderRadius: "5px",
                                textAlign: "center",
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

export default Register;
