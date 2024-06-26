import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import contactImg from "../../images/contact-img.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../../App.css";

import TrackVisibility from "react-on-screen";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export const Form = () => {
  const clearForm = () => {
    setSelectedDate("");
    setSelectedTime("");
    setSelectedTime2("");
    setRequest("");
    setSelectedDepartment("");
    setReason("");
  };
  const moment = require("moment-timezone");

  const [buttonText] = useState("Submit Form");
  const [clearText] = useState("Clear");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shift, setShift] = useState("");
  const [location, setLoc] = useState("");

  const [date, setSelectedDate] = useState("");
  const [timefrom, setSelectedTime] = useState("");
  const [timeto, setSelectedTime2] = useState("");
  const [duration, setSelectedHour] = useState("");
  const [by, setRequest] = useState("");
  const [department, setSelectedDepartment] = useState("");
  const [reason, setReason] = useState("");
  const [backdropOpen, setBackdropOpen] = useState(false);

  // Function to convert time string to Date object
  const parseTime = (timeString) => {
    // Split timeString into hours, minutes, and AM/PM parts
    const [time, period] = timeString.split(" ");
    const [hourStr, minuteStr] = time.split(":");

    // Convert hours and minutes to numbers
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Adjust hours for PM if necessary
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date;
  };
  // Calculate duration function
  const calculateDuration = useCallback((timeFromString, timeToString) => {
    const timeFrom = parseTime(timeFromString);
    const timeTo = parseTime(timeToString);

    const durationInMs = Math.abs(timeTo - timeFrom);
    const durationInHours = Math.floor(durationInMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
      (durationInMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${durationInHours} hours and ${remainingMinutes} minutes`;
  }, []);

  useEffect(() => {
    if (timefrom && timeto) {
      const newDuration = calculateDuration(timefrom, timeto);
      setSelectedHour(newDuration);
    }
  }, [timefrom, timeto, calculateDuration]);

  const onChange = (name, e) => {
    switch (name) {
      case "date":
        setSelectedDate(e.target.value);
        break;
      case "timefrom":
        setSelectedTime(e.target.value);

        break;
      case "timeto":
        setSelectedTime2(e.target.value);

        break;
      case "by":
        setRequest(e.target.value);
        break;
      case "department":
        setSelectedDepartment(e.target.value);
        break;
      case "reason":
        setReason(e.target.value);
        break;
      default:
        break;
    }
  };

  // Generate time options in 12-hour format (e.g., "10:00 AM")
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date();
        time.setHours(hour);
        time.setMinutes(minute);
        options.push({
          value: time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          label: time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    }
    return options;
  };
  const timeOptions = generateTimeOptions(); // Ensure timeOptions is correctly defined

  // Generate hour options from 1 hour to 23 hours

  const generateHourOptions = () => {
    const options = [];
    for (let hour = 1; hour <= 23; hour++) {
      options.push({
        value: hour.toString(), // Convert hour to string
        label: `${hour} Hour${hour !== 1 ? "s" : ""}`, // Display "hour" or "hours" based on the value
      });
    }

    // Include an additional option for "hours"
    options.push({
      value: "Hours", // A non-numeric value representing "hours"
      label: "Hours",
    });

    return options;
  };
  generateHourOptions();

  // Define department options
  const departmentOptions = [
    { value: "", label: "Department", disabled: true },
    { value: "MIS", label: "MIS" },
    { value: "HR & ADMIN DEPARTMENT", label: "HR & ADMIN DEPARTMENT" },
    { value: "DEVELOPMENT UNIT", label: "DEVELOPMENT UNIT" },
    { value: "OGM", label: "OGM" },
  ];

  const getProfile = async () => {
    try {
      const res = await fetch("https://otnsbackend.vercel.app/api/dashboard/", {
        method: "GET",
        headers: { jwt_token: localStorage.token },
      });

      const parseData = await res.json();
      setName(parseData.emp_name);
      setShift(parseData.emp_shift);
      setEmail(parseData.emp_email);
      setLoc(parseData.emp_location);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  //increment currentOtr number based on the fetched OTR (this is applicable to spreadsheet)
  const [currentOTRNumber, setCurrentOTRNumber] = useState("");

  const incrementOTRNumber = (currentOTRNumber) => {
    const incrementedNumber =
      parseInt(currentOTRNumber.replace("OTR-", ""), 10) + 1;
    return "OTR-" + incrementedNumber.toString().padStart(5, "0");
  };

  const generateFormattedOTRNumber = (number) => {
    const numberWithoutPrefix = parseInt(number.replace("OTR-", ""), 10);
    const formattedNumber = numberWithoutPrefix.toString().padStart(5, "0");
    return "OTR-" + formattedNumber;
  };

  //fetch current OTRnumber
  useEffect(() => {
    const fetchCurrentOTRNumber = async () => {
      try {
        const response = await fetch(
          "https://otnsbackend.vercel.app/api/request/otr"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch current OTR number");
        }
        const data = await response.json();
        const currentOTRNumber = data.currentOTRNumber;

        // Check if currentOTRNumber is defined
        if (typeof currentOTRNumber !== "undefined") {
          // Increment the current OTR number
          const nextOTRNumber = incrementOTRNumber(currentOTRNumber);

          // Format the incremented OTR number
          const formattedOTRNumber = generateFormattedOTRNumber(nextOTRNumber);

          // Save the updated OTR number to the state
          setCurrentOTRNumber(formattedOTRNumber);
        } else {
          throw new Error("Received undefined value for current OTR number");
        }
      } catch (error) {
        console.error("Error fetching current OTR number:", error);
        // Handle the error (e.g., show a message to the user)
      }
    };

    fetchCurrentOTRNumber();
  }, [timeto]);

  //Submit form while also posting the recorded form to google spreadsheet
  const onSubmitForm = async (e) => {
    e.preventDefault();

    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

    if (
      !name ||
      !email ||
      !shift ||
      !location ||
      !date ||
      !timeto ||
      !timefrom ||
      !duration ||
      !by ||
      !department ||
      !reason
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const formattedDate = moment(date).format("MM-DD-YYYY");

    const payload = {
      Timestamp: timestamp,
      Overtime_Request_No: currentOTRNumber,
      Email_Address: email,
      Name: name,
      Current_Schedule: shift,
      Date: formattedDate,
      Time_To: timeto,
      Time_From: timefrom,
      Reason_For_Overtime: reason,
    };

    try {
      const response = await fetch(
        "https://otnsbackend.vercel.app/api/google-apps-script-proxy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
      } else {
        console.error("Error sending data:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    // axios
    //   .post(
    //     "https://sheet.best/api/sheets/91691420-22d6-4fd7-94ca-357b4bb496d0",
    //     data
    //   )
    //   .then((response) => {
    //     console.log(response);
    //   });
    // Form validation (you can add more validation as needed)

    //try connecting to auth and post registration
    try {
      setBackdropOpen(true); // Show backdrop

      const body = {
        name,
        email,
        shift,
        location,
        date,
        timeto,
        timefrom,
        duration,
        by,
        department,
        reason,
        timestamp,
      };

      const response = await fetch(
        "https://otnsbackend.vercel.app/api/request/insert",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        // If response status is not ok, handle the error
        const text = await response.text(); // Get the non-JSON response text
        toast.error(text || "An error occurred"); // Display the error message if available
      }
    } catch (err) {
      console.error(err.message);
      // Handle network errors or unexpected errors
    } finally {
      setBackdropOpen(false); // Hide backdrop
    }
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="form" id="request">
      <ToastContainer />
      <Container>
        <Row className="align-items-center ">
          <Col size={12} md={6} className="px-1 pb-4 pb-sm-0 mx-0">
            <TrackVisibility>
              {({ isVisible }) => (
                <img
                  className={
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }
                  src={contactImg}
                  alt="Contact Us"
                />
              )}
            </TrackVisibility>
          </Col>
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <h2>OT Request Form</h2>

                  <form onSubmit={onSubmitForm}>
                    <Row>
                      <Col size={12} sm={10} className="px-2 pb-1 pb-sm-0 mx-2">
                        <input
                          type="text"
                          placeholder={name}
                          value={name}
                          disabled
                          style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                            color: "white",
                            // Add any additional styles here
                          }}
                        />
                      </Col>

                      <Col size={12} sm={10} className="px-2 pb-1 pb-sm-0 mx-2">
                        <input
                          type="email"
                          placeholder={email}
                          value={email}
                          disabled
                          style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                            color: "white",
                            // Add any additional styles here
                          }}
                        />
                      </Col>
                      <Col
                        size={12}
                        sm={5}
                        className="px-3 pb-1 pb-sm-0 mx-0 mx-sm-0"
                      >
                        <input
                          type="text"
                          placeholder={shift}
                          value={shift}
                          disabled
                          style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                            color: "white",
                            // Add any additional styles here
                          }}
                        />
                      </Col>
                      <Col
                        size={12}
                        sm={5}
                        className="px-3 pb-1 pb-sm-0 mx-0 mx-sm-3"
                      >
                        <input
                          type="text"
                          placeholder={location}
                          value={location}
                          disabled
                          style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                            color: "white",
                            // Add any additional styles here
                          }}
                        />
                      </Col>

                      <Col
                        size={12}
                        sm={5}
                        className="px-3 pb-1 pb-sm-0 mx-0 mx-sm-0"
                      >
                        {isMobile && (
                          <label htmlFor="dateInput">Select Date:</label>
                        )}{" "}
                        <input
                          id="dateInput"
                          type="date"
                          value={date}
                          onChange={(e) => onChange("date", e)}
                        />
                      </Col>
                      <Col
                        size={12}
                        sm={5}
                        className="px-3 pb-1 pb-sm-0 mx-0 mx-sm-3"
                      >
                        <input
                          type="text"
                          placeholder="Supervisor"
                          value={by}
                          onChange={(e) => onChange("by", e)}
                        />
                      </Col>

                      <Col
                        size={12}
                        sm={5}
                        className="px-3 pb-1 pb-sm-0 mx-0 mx-sm-0"
                      >
                        <select
                          name="timefrom"
                          value={timefrom}
                          onChange={(e) => onChange("timefrom", e)}
                          className="form-control2"
                        >
                          <option value="" disabled>
                            Time From
                          </option>
                          {timeOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Col>
                      <Col
                        size={12}
                        sm={5}
                        className="px-3 pb-1 pb-sm-0 mx-0 mx-sm-3"
                      >
                        <select
                          name="timeto"
                          value={timeto}
                          onChange={(e) => onChange("timeto", e)}
                          className="form-control2"
                        >
                          <option value="" disabled>
                            Time To
                          </option>
                          {timeOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Col>
                      <Col
                        size={12}
                        sm={5}
                        className="px-3 pb-1 pb-sm-0 mx-0 mx-sm-0"
                      >
                        <input
                          name="text"
                          value={duration}
                          placeholder="Duration"
                          disabled
                          style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                            color: "white",
                            // Add any additional styles here
                          }}
                          className="form-control2"
                        ></input>
                      </Col>
                      <Col
                        size={12}
                        sm={5}
                        className="px-3 pb-1 pb-sm-0 mx-0 mx-sm-3"
                      >
                        <select
                          name="department"
                          value={department}
                          onChange={(e) => onChange("department", e)}
                          className="form-control2"
                        >
                          {departmentOptions.map((option, index) => (
                            <option
                              key={index}
                              value={option.value}
                              disabled={option.disabled}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Col>

                      <Col size={12} sm={10} className="px-2 pb-1 pb-sm-1 mx-2">
                        <textarea
                          rows="2"
                          placeholder="Reason"
                          value={reason}
                          onChange={(e) => onChange("reason", e)}
                        ></textarea>
                      </Col>
                      <Col size={12} sm={10} className="px-2 pb-2 pb-sm-1 mx-2">
                        <button type="submit">
                          <span>{buttonText}</span>
                        </button>
                      </Col>
                      <Col size={12} sm={6} xl={7} className="px-2 mx-2">
                        <div className="Clear" onClick={clearForm}>
                          <span>{clearText}</span>
                        </div>
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
