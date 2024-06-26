import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../../images/Logo.png"; //

import navIcon4 from "../../images/user-regular.svg"; //

import { HashLink } from "react-router-hash-link";
import { toast } from "react-toastify";

export const NavBar2 = ({ setAuth }) => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  };

  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("emp");

      setAuth(false);
      toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  //Setting role id for supervisor to access different route to ensure that their token and role is valid

  const handleRoleChange = () => {
    const role = "4BWQd23ZqVxF1GWkVdRJrPExv/v#$C0$f1JIYCT/dWMClhHkt5XV64jd542$";
    localStorage.setItem("emp", role);
  };

  const handleProfileChange = () => {
    const role =
      "qVxF1GWkv0R#1CWQd3BKfVJhVdFdP2GC$sOTqXVdHlWwJ$//PVdQJ&42nWB1FVJ/lV%^C";
    localStorage.setItem("emp", role);
  };

  return (
    <Navbar expand="md" className={"scrolled"}>
      <Container>
        <Navbar.Brand href="/supdash" onClick={() => handleRoleChange()}>
          <img src={logo} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"></Navbar.Toggle>
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="navbarr justify-content-center align-items-center"
        >
          <Nav className="ms-auto">
            <Nav.Link
              href="#home"
              className={
                activeLink === "home" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("home")}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              href="#pending"
              className={
                activeLink === "pending" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("pending")}
            >
              OT Pending Request
            </Nav.Link>
            <Nav.Link
              href="#approved"
              className={
                activeLink === "approved" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("approved")}
            >
              OT Approved Request
            </Nav.Link>
            <Nav.Link
              href="#reject"
              className={
                activeLink === "reject" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("reject")}
            >
              OT Rejected Request
            </Nav.Link>
          </Nav>

          <span className="navbar-text">
            <div className="social-icon">
              <a href="supdash/profile" onClick={() => handleProfileChange()}>
                <img src={navIcon4} alt="" />
              </a>
            </div>
          </span>
          <span className="navbar-text">
            <HashLink to="#connect">
              <button onClick={(e) => logout(e)} className="vvd d-flex">
                <span>Logout</span>
              </button>
            </HashLink>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
