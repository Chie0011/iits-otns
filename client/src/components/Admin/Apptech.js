import React, { useState, useEffect } from "react";
import "../../App.css";
import "react-toastify/dist/ReactToastify.css";
import EditUser from "./EditUser";
import EditShift from "./EditShift";

import { toast, ToastContainer } from "react-toastify";
import AddLocation from "../AddLocation";
import AddShift from "../AddShift";

const Apptech = ({ setAuth }) => {
  //gradient color background registration
  useEffect(() => {
    document.body.classList.add("registration-page");

    return () => {
      document.body.classList.remove("registration-page");
    };
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

  // Fetch users and their total requests per month from the backend

  useEffect(() => {
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

  const [loc, setLocation] = useState([]); // Initialize loc as an empty array

  // Fetch location from backend to database

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          "https://otnsbackend.vercel.app/api/auth/admin/loc"
        );
        const jsonData = await response.json();
        console.log(jsonData);
        setLocation(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchLocation();
  }, []);

  const [shift, setShift] = useState([]); // Initialize loc as an empty array

  // Fetch current shift from backend to database

  useEffect(() => {
    const fetchShift = async () => {
      try {
        const response = await fetch(
          "https://otnsbackend.vercel.app/api/auth/admin/shifts"
        );
        const jsonData = await response.json();
        console.log(jsonData);
        setShift(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchShift();
  }, []);

  const [info, setInfo] = useState([]);

  //deleting request per user
  const deleteRequest = async (id) => {
    try {
      const response = await fetch(
        `https://otnsbackend.vercel.app/api/request/${id}`,
        {
          method: "DELETE",
          headers: { jwt_token: localStorage.token },
        }
      );

      if (response.ok) {
        setInfo(info.filter((user) => user.emp_id !== id));
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete form");
      }
    } catch (err) {
      console.error("Failed to delete form:", err);
      toast.error("An error occurred while deleting the form");
    }
  };

  //deleting location per user
  const deleteLocation = async (id) => {
    try {
      const response = await fetch(
        `https://otnsbackend.vercel.app/api/auth/admin/${id}`,
        {
          method: "DELETE",
          headers: { jwt_token: localStorage.token },
        }
      );

      if (response.ok) {
        setInfo(info.filter((location) => location.loc_id !== id));
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete form");
      }
    } catch (err) {
      console.error("Failed to delete form:", err);
      toast.error("An error occurred while deleting the form");
    }
  };

  //delete shifts per user
  const deleteShift = async (id) => {
    try {
      const response = await fetch(
        `https://otnsbackend.vercel.app/api/auth/admin/shift/${id}`,
        {
          method: "DELETE",
          headers: { jwt_token: localStorage.token },
        }
      );

      if (response.ok) {
        setInfo(info.filter((shifts) => shifts.shift_id !== id));
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete form");
      }
    } catch (err) {
      console.error("Failed to delete form:", err);
      toast.error("An error occurred while deleting the form");
    }
  };
  return (
    //Frontend page for AppTech User, locations, and Shifts.
    <>
      <ToastContainer />
      <div className="main-container">
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
                      <th>Action</th>
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
                                entry.month_year === getMonthYearFormat(month)
                            )?.total_requests || 0}
                          </td>
                        ))}
                        <td>
                          <div style={{ display: "flex" }}>
                            <EditUser user={user} />
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this?"
                                  )
                                ) {
                                  deleteRequest(user.emp_id);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="aech">
          <button style={{ marginBottom: "50px" }}>
            <AddLocation />
          </button>
        </div>
        <div className="location">
          <div className="row">
            <div className="col">
              <div className="table-responsive">
                <table className="table">
                  <thead className="bg-dark">
                    <tr>
                      <th>Location</th>
                      <th
                        style={{
                          textAlign: "right",
                          marginRight: "100px",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loc.length > 0 ? (
                      loc.map((location) => (
                        <tr key={location.loc_id}>
                          <td>{location.loc_name}</td>
                          <td
                            style={{ alignItems: "right", textAlign: "right" }}
                          >
                            {" "}
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this?"
                                  )
                                ) {
                                  deleteLocation(location.loc_id);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No locations available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="aech">
          <button style={{ marginBottom: "50px" }}>
            <AddShift />
          </button>
        </div>
        <div className="location">
          <div className="row">
            <div className="col">
              <div className="table-responsive">
                <table className="table">
                  <thead className="bg-dark">
                    <tr>
                      <th>Shift Type</th>
                      <th>Shift Time</th>

                      <th
                        style={{
                          textAlign: "right",
                          marginRight: "100px",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shift.length > 0 ? (
                      shift.map((shifts) => (
                        <tr key={shifts.shift_id}>
                          <td>{shifts.shift_name}</td>
                          <td>{shifts.shift_times}</td>
                          <td>
                            <div style={{ display: "flex" }}>
                              <EditShift shifts={shifts} />
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this?"
                                    )
                                  ) {
                                    deleteShift(shifts.shift_id);
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No Shift available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Apptech;
