import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BsPersonCircle, BsJustify, BsEnvelope } from "react-icons/bs";

function Header({ OpenSidebar }) {
  const handleProfileChange = () => {
    const role =
      "$6ZHJyMTc1CdP2GC$sOTqXWkv0R#1CWQd3WwJ$//PVdQJIYCT/dFVJ/lV%$4BO$4BO";
    localStorage.setItem("emp", role);
  };

  const [pendingCount, setPendingCount] = useState(0);

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

        const { pendingCount } = await res.json();

        // Set pending count
        setPendingCount(pendingCount);
      } catch (err) {
        console.error(err.message);
        toast.error("Failed to fetch request data");
      }
    };

    fetchRequestData();
  }, []);

  const [, setPendingRequests] = useState([]);
  const [showPendingRequests, setShowPendingRequests] = useState(false);

  //fetching pending request to convert it as badge in the header
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

  const handleIconClick = () => {
    setShowPendingRequests(!showPendingRequests);
    if (!showPendingRequests) {
      fetchPendingRequests();
    }
  };

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="sidebar-list-item2" onClick={handleIconClick}>
        <BsEnvelope className="icon" />
        {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
      </div>

      <div className="sidebar-list-item">
        <a href="/addash/profile" onClick={() => handleProfileChange()}>
          <BsPersonCircle className="icon" />
        </a>
      </div>
    </header>
  );
}

export default Header;
