import React from "react";
import axios from "axios";
import RequestDetailsModal from "./RequestDetailsModal";
import { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Home({ setAuth }) {
  useEffect(() => {
    document.body.classList.add("registration-page");

    return () => {
      document.body.classList.remove("registration-page");
    };
  }, []);

  const [pendingRequests, setPendingRequests] = useState([]);

  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [locationsWithCounts, setLocationsWithCounts] = useState([]);
  const [admin, setEmail] = useState();
  const setMail = admin;

  //fetching info of the admin with the headers
  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/admin/", {
        method: "GET",
        headers: { jwt_token: localStorage.token },
      });

      if (res.ok) {
        const parseData = await res.json();

        setEmail(parseData.admin_email);
        console.log("email:", setEmail);

        // setShift(parseData.emp_shift);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("emp");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  //fetching total count of request
  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const res = await fetch(
          "https://otnsbackend.vercel.app/api/auth/supervisor/count/",
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

  //fetching request per location
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://otnsbackend.vercel.app/api/auth/admin/location/",
          {
            method: "GET",
            headers: { jwt_token: localStorage.token },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const { countsPerLocation } = await res.json();

        // Convert countsPerLocation object to an array of objects
        const locationsWithCounts = Object.entries(countsPerLocation).map(
          ([location, counts]) => ({
            location,
            totalCount: counts.totalCount || 0,
            pendingCount: counts.pendingCount || 0,
            approvedCount: counts.approvedCount || 0,
            rejectedCount: counts.rejectedCount || 0,
          })
        );

        // Set the state with the fetched data
        setLocationsWithCounts(locationsWithCounts);
      } catch (err) {
        console.error(err.message);
        // Handle error
      }
    };

    fetchData();
  }, []);

  //fetching recent request
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(
          "https://otnsbackend.vercel.app/api/auth/admin/recent/",
          {
            headers: { jwt_token: localStorage.token },
          }
        );
        if (response.data) {
          setPendingRequests(response.data);
        }
      } catch (error) {
        console.error("Error fetching pending OT requests:", error);
      }
    };

    fetchPendingRequests();
  }, []);

  const [chartData, setChartData] = useState([]);

  //fetching total request per date
  useEffect(() => {
    const fetchOTRequestsData = async () => {
      try {
        const response = await fetch(
          "https://otnsbackend.vercel.app/api/auth/admin/date"
        );
        if (response.ok) {
          const data = await response.json();
          setChartData(data);
        } else {
          console.error("Failed to fetch OT request data");
        }
      } catch (error) {
        console.error("Error fetching OT request data:", error);
      }
    };

    fetchOTRequestsData();
  }, []);

  //fetching recent request
  useEffect(() => {
    const getRequest = async () => {
      try {
        const res = await fetch(
          "https://otnsbackend.vercel.app/api/auth/admin/request/",
          {
            method: "GET",
            headers: { jwt_token: localStorage.token },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    getRequest();
  }, []);

  //formatting OT number to include OTR
  function formatReqId(reqId) {
    // Convert reqId to string
    let formattedId = reqId.toString();
    // Calculate the length of the formatted ID
    const idLength = formattedId.length;
    // Determine the number of leading zeros to add
    const zerosToAdd = 5 - idLength;
    // Add leading zeros
    for (let i = 0; i < zerosToAdd; i++) {
      formattedId = "0" + formattedId;
    }
    // Add prefix 'OTR-' and return the formatted ID
    return "OTR-" + formattedId;
  }

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>TOTAL REQUEST</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          {<h1>{totalCount}</h1>}
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>PENDING</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{pendingCount}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>APPROVED</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{approvedCount}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>REJECTED</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>{rejectedCount}</h1>
        </div>
      </div>
      <div className="recent">
        <h3>RECENT REQUEST</h3>
      </div>
      <div className="pending">
        <div className="row">
          <div className="col">
            <div className="table-responsive">
              <table className="table">
                <thead className="bg-dark">
                  <tr>
                    <th>OT Request No.</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Render table rows based on request data */}
                  {pendingRequests?.map((ot_request) => (
                    <tr key={ot_request.req_id}>
                      <td>{formatReqId(ot_request.req_id)}</td>
                      <td>{ot_request.req_name}</td>
                      <td>
                        {new Date(ot_request.req_date).toLocaleDateString()}
                      </td>
                      <td>{ot_request.req_location}</td>
                      <td>
                        <RequestDetailsModal
                          ot_request={ot_request}
                          setMail={setMail}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="charts" style={{ width: "100%" }}>
        <ResponsiveContainer width="100%" height={400}>
          <div className="total">
            <h3>REQUEST PER DATE</h3>
          </div>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis
              dataKey="month_year"
              tick={{ fill: "white", angle: -10, textAnchor: "end" }}
              interval={0}
              tickSize={8}
            />
            <YAxis tick={{ fill: "white" }} style={{ overflowY: "auto" }} />
            <Tooltip
              formatter={(value, name, props) => [
                `${value} (${props.payload.date})`,
                name,
              ]}
            />
            <Legend />
            <Bar dataKey="total_requests" fill="orange" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="req">
        <h3>REQUEST PER LOCATION</h3>
      </div>
      <div className="location">
        <div className="row">
          <div className="col">
            <div className="table-responsive">
              <table className="table">
                <thead className="bg-dark">
                  <tr>
                    <th>No.</th>
                    <th>Pending</th>
                    <th>Approved</th>
                    <th>Rejected</th>
                    <th>Total Request</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {locationsWithCounts.map((locationData, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>{locationData.pendingCount}</td>
                      <td>{locationData.approvedCount}</td>
                      <td>{locationData.rejectedCount}</td>
                      <td>{locationData.totalCount}</td>
                      <td>{locationData.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
