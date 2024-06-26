import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../App.css";

import TrackVisibility from "react-on-screen";

import { validateUsername } from "../../validation/userValidation";
import { validateEmail } from "../../validation/emailValidation";
import { validatePassword } from "../../validation/passwordValidation";
import { validatePhone } from "../../validation/phoneValidation";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Profile = ({ setAuth }) => {
  //gradient color background registration
  useEffect(() => {
    document.body.classList.add("registration-page");

    return () => {
      document.body.classList.remove("registration-page");
    };
  }, []);

  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [shift, setShift] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const [buttonText] = useState("Update Profile");
  const [selectedValue, setSelectedValue] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [backdropOpen, setBackdropOpen] = useState(false);

  // const [shiftError, setShiftError] = useState("");
  // const [locationError, setLocationError] = useState("");

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
        // const locationError = validateLocation(value);
        // setLocationError(locationError);
        break;
      // Add more cases for other fields as needed
      default:
        break;
    }
  };

  //fetching user information
  const getProfile = useCallback(async () => {
    try {
      const res = await fetch("https://otnsbackend.vercel.app/api/dashboard/", {
        method: "GET",
        headers: { jwt_token: localStorage.token },
      });

      if (res.ok) {
        const parseData = await res.json();
        setID(parseData.emp_id);
        setName(parseData.emp_name);
        setEmail(parseData.emp_email);
        setPhone(parseData.emp_phone);
        setLocation(parseData.emp_location);
        setPassword(parseData.emp_password);
        // setShift(parseData.emp_shift);
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

  //submitting the updated information made by user
  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !shift || !location || !phone) {
      toast.error("Please fill in all fields.");
      return;
    }

    //try connecting to auth and post registration
    try {
      setBackdropOpen(true); // Show backdrop

      const body = {
        id,
        name,
        email,
        password,
        shift: selectedValue,
        location,
        phone,
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

  const [shiftTime, setShifts] = useState([]);

  //fetching current shift info of the user
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
                  <h2>Update AppTech Profile</h2>

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
                          disabled
                          value={email}
                          onChange={(e) => onChange("email", e.target.value)}
                        />
                        <p className="error-message">{emailError}</p>
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <input
                          type="tel"
                          placeholder="Phone No."
                          value={phone}
                          onChange={(e) => onChange("phone", e.target.value)}
                        />
                        <p className="error-message">{phoneError}</p>
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => onChange("password", e.target.value)}
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
                                  .find((shifts) => shifts.shift_name === shift)
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
                          onChange={(e) => onChange("location", e.target.value)}
                          className="form-control2"
                        >
                          <option value="" disabled>
                            Select Location
                          </option>
                          <option value="Laguna">Laguna</option>
                          <option value="Pampanga">Pampanga</option>
                          <option value="CDO">CDO</option>
                          <option value="Cebu">Cebu</option>

                          {/* Add more shift options as needed */}
                        </select>
                      </Col>

                      <Col size={12} md={12} className="px-1">
                        <button
                          type="submit"
                          style={{
                            backgroundColor:
                              nameError || phoneError ? "#ff0000" : "",
                            marginBottom: "80px",
                          }}
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

export default Profile;
