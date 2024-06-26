import React, { Fragment, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./components/Admin/App.css";

import { ToastContainer, toast } from "react-toastify";

//APPTECH
import Dashboard from "./components/Apptech/Dashboard";
import { OThistory } from "./components/Apptech/OThistory";
import { OTapproved } from "./components/Apptech/OTapproved";
import { OTrejected } from "./components/Apptech/OTrejected";
import { Form } from "./components/Apptech/Form";
import { NavBar } from "./components/Apptech/NavBar";
import { ProvBar } from "./components/Apptech/ProvBar";
import Register from "./components/Register";
import EmailVerify from "./components/EmailVerify";
import Profile from "./components/Apptech/Profile";

//SUPERVISOR
import Supervisor from "./components/Supervisor/supdashboard";
import { NavBar2 } from "./components/Supervisor/NavBar";
import { OThistory2 } from "./components/Supervisor/OThistory";
import { OTrejectedS } from "./components/Supervisor/OTrejected";
import { OTapprovedS } from "./components/Supervisor/OTapproved";
import { ProvBar2 } from "./components/Supervisor/ProvBar";
import Profile2 from "./components/Supervisor/Profile";

//ADMIN
import Header from "./components/Admin/Header";
import Sidebar from "./components/Admin/Sidebar";
import Home from "./components/Admin/Home";
import { OThistory3 } from "./components/Admin/OThistory";
import Apptech from "./components/Admin/Apptech";
import Profile3 from "./components/Admin/Profile";

//GENERAL
import Login from "./components/Login";
import Forgot from "./components/Forgot";
import ResetPasswordForm from "./components/Reset";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  const [auth, setAuth] = useState({ isAuthenticated: false, role: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthenticated = async () => {
      try {
        const token = localStorage.getItem("token");
        const empRole = localStorage.getItem("emp");

        if (token && empRole) {
          const res = await fetch(
            "https://otnsbackend.vercel.app/api/auth/users/is-verify",
            {
              method: "GET",
              headers: { jwt_token: token },
            }
          );

          const parseRes = await res.json();

          if (parseRes.isValidToken) {
            setAuth({ isAuthenticated: true, role: empRole });
          } else {
            handleInvalidToken();
          }
        } else {
          handleInvalidToken();
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        handleInvalidToken();
      } finally {
        setLoading(false);
      }
    };
    const handleInvalidToken = () => {
      const token = localStorage.getItem("token");
      const empRole = localStorage.getItem("emp");

      if (token && empRole) {
        localStorage.removeItem("token");
        localStorage.removeItem("emp");

        setAuth({ isAuthenticated: false, role: "" });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("emp");
        setAuth({ isAuthenticated: false, role: "" });
      }
    };

    checkAuthenticated();
  }, []);

  const updateAuth = (boolean, role) => {
    setAuth({ isAuthenticated: boolean, role });
    if (boolean) {
      toast.success("Login Successfully");
    }
  };

  const renderRoutes = () => {
    if (loading) {
      return (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }

    return (
      <Routes>
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/:email/verify/:token" element={<EmailVerify />} />
        <Route path="/reset/:email/:token" element={<ResetPasswordForm />} />
        <Route
          path="/login"
          element={
            auth.isAuthenticated ? (
              <Navigate to={getDashboardRoute(auth.role)} />
            ) : (
              <Login setAuth={updateAuth} />
            )
          }
        />
        <Route exact path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/appdash"
          element={
            auth.isAuthenticated &&
            auth.role ===
              "$41321d54CK$$#I/GWvExCVl/JVF0T1Of0BwwdqBWn2JqVdPVjRmQVxctMYhJZ6" ? (
              <>
                <NavBar setAuth={updateAuth} />
                <Dashboard setAuth={updateAuth} />
                <Form />
                <OThistory />
                <OTapproved />
                <OTrejected />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/appdash/profile"
          element={
            auth.isAuthenticated &&
            auth.role ===
              "$6JZ61x2IvGcv0R#1CWQd3BKfVJhVdFdP2Gd/M1J54C$sOTqXVdHlWwJ$//Eyn/3$4BO%FVdYT12EijQZo#CVlM" ? (
              <>
                <ProvBar setAuth={updateAuth} />
                <Profile setAuth={updateAuth} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/supdash"
          element={
            auth.isAuthenticated &&
            auth.role ===
              "4BWQd23ZqVxF1GWkVdRJrPExv/v#$C0$f1JIYCT/dWMClhHkt5XV64jd542$" ? (
              <>
                <Supervisor setAuth={updateAuth} />
                <NavBar2 setAuth={updateAuth} />
                <OThistory2 />
                <OTapprovedS />
                <OTrejectedS />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/supdash/profile"
          element={
            auth.isAuthenticated &&
            auth.role ===
              "qVxF1GWkv0R#1CWQd3BKfVJhVdFdP2GC$sOTqXVdHlWwJ$//PVdQJ&42nWB1FVJ/lV%^C" ? (
              <>
                <ProvBar2 setAuth={updateAuth} />
                <Profile2 setAuth={updateAuth} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/addash"
          element={
            auth.isAuthenticated &&
            auth.role ===
              "$6ZHJyMTcVjPVdQJ&42nWBqdww0FVO1FVJ/lV%^CxEvWG/IKC45d12314" ? (
              <div className="grid-container">
                <Header OpenSidebar={OpenSidebar} />
                <Sidebar
                  setAuth={updateAuth}
                  openSidebarToggle={openSidebarToggle}
                  OpenSidebar={OpenSidebar}
                />
                <Home setAuth={updateAuth} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/addash/profile"
          element={
            auth.isAuthenticated &&
            auth.role ===
              "$6ZHJyMTc1CdP2GC$sOTqXWkv0R#1CWQd3WwJ$//PVdQJIYCT/dFVJ/lV%$4BO$4BO" ? (
              <>
                <div className="grid-container">
                  <Header OpenSidebar={OpenSidebar} />
                  <Sidebar
                    setAuth={updateAuth}
                    openSidebarToggle={openSidebarToggle}
                    OpenSidebar={OpenSidebar}
                  />
                  <Profile3 setAuth={updateAuth} />
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/addash/otrequest"
          element={
            auth.isAuthenticated &&
            auth.role ===
              "FdP2Gc1CdP2GC$sOTqJyMTcVjPQd3WCWQd3BKfVdQJIYVdQJ&42nWB1CdP2G%$4BO$4BO" ? (
              <>
                <div className="grid-container">
                  <Header OpenSidebar={OpenSidebar} />
                  <Sidebar
                    setAuth={updateAuth}
                    openSidebarToggle={openSidebarToggle}
                    OpenSidebar={OpenSidebar}
                  />
                  <OThistory3 />
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/addash/apptech"
          element={
            auth.isAuthenticated &&
            auth.role ===
              "WQd3W2G1CdP2$sOTqXGQd3yMTcVdd/C$sOTqXWkvM1J54C$s2nWBMTcVjPVdQ1CQd3f0BwwdqBWBKfVJO$4BO" ? (
              <>
                <div className="grid-container">
                  <Header OpenSidebar={OpenSidebar} />
                  <Sidebar
                    setAuth={updateAuth}
                    openSidebarToggle={openSidebarToggle}
                    OpenSidebar={OpenSidebar}
                  />
                  <Apptech />
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    );
  };

  const getDashboardRoute = (role) => {
    switch (role) {
      case "$41321d54CK$$#I/GWvExCVl/JVF0T1Of0BwwdqBWn2JqVdPVjRmQVxctMYhJZ6":
        return "/appdash";
      case "4BWQd23ZqVxF1GWkVdRJrPExv/v#$C0$f1JIYCT/dWMClhHkt5XV64jd542$":
        return "/supdash";
      case "$6ZHJyMTcVjPVdQJ&42nWBqdww0FVO1FVJ/lV%^CxEvWG/IKC45d12314":
        return "/addash";
      case "$6JZ61x2IvGcv0R#1CWQd3BKfVJhVdFdP2Gd/M1J54C$sOTqXVdHlWwJ$//Eyn/3$4BO%FVdYT12EijQZo#CVlM":
        return "/appdash/profile";
      case "qVxF1GWkv0R#1CWQd3BKfVJhVdFdP2GC$sOTqXVdHlWwJ$//PVdQJ&42nWB1FVJ/lV%^C":
        return "/supdash/profile";
      case "$6ZHJyMTc1CdP2GC$sOTqXWkv0R#1CWQd3WwJ$//PVdQJIYCT/dFVJ/lV%$4BO$4BO":
        return "/addash/profile";
      case "FdP2Gc1CdP2GC$sOTqJyMTcVjPQd3WCWQd3BKfVdQJIYVdQJ&42nWB1CdP2G%$4BO$4BO":
        return "/addash/otrequest";
      case "WQd3W2G1CdP2$sOTqXGQd3yMTcVdd/C$sOTqXWkvM1J54C$s2nWBMTcVjPVdQ1CQd3f0BwwdqBWBKfVJO$4BO":
        return "/addash/apptech";
      default:
        return "/login";
    }
  };

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <>
      <ToastContainer />
      <Router>{renderRoutes()}</Router>
    </>
  );
}

export default App;
