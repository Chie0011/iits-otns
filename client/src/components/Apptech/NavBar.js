import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../../images/Logo.png"; //

import navIcon4 from "../../images/user-regular.svg"; //

import { HashLink } from "react-router-hash-link";
import { toast } from "react-toastify";

export const NavBar = ({ setAuth }) => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  //Setting role id for user to access different route to ensure that their token and role is valid
  const handleRoleChange = () => {
    const role =
      "$41321d54CK$$#I/GWvExCVl/JVF0T1Of0BwwdqBWn2JqVdPVjRmQVxctMYhJZ6";
    localStorage.setItem("emp", role);
  };

  const handleProfileChange = () => {
    const role =
      "$6JZ61x2IvGcv0R#1CWQd3BKfVJhVdFdP2Gd/M1J54C$sOTqXVdHlWwJ$//Eyn/3$4BO%FVdYT12EijQZo#CVlM";
    localStorage.setItem("emp", role);
  };

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

  return (
    <Navbar expand="md" className={"scrolled"}>
      <Container>
        <Navbar.Brand href="/appdash" onClick={() => handleRoleChange()}>
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
              onClick={() => {
                onUpdateActiveLink("home");
                handleRoleChange();
              }}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              href="#request"
              className={
                activeLink === "request" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("request")}
            >
              OT Request Form
            </Nav.Link>
            <Nav.Link
              href="#status"
              className={
                activeLink === "projects" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("projects")}
            >
              OT Request Status
            </Nav.Link>
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <a href="appdash/profile" onClick={() => handleProfileChange()}>
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
