import React from "react";
import { BsFillGearFill } from "react-icons/bs";
import { FcOvertime } from "react-icons/fc";
import { RxDashboard } from "react-icons/rx";
import { MdOutlinePeopleAlt } from "react-icons/md";

import Logo from "../../images/Logo.png"; // Adjust the path as per your directory structure

//Setting role id for admin to access different route to ensure that their token and role is valid
const handleRoleChange = () => {
  const role = "$6ZHJyMTcVjPVdQJ&42nWBqdww0FVO1FVJ/lV%^CxEvWG/IKC45d12314";
  localStorage.setItem("emp", role);
};

const handleOTChange = () => {
  const role =
    "FdP2Gc1CdP2GC$sOTqJyMTcVjPQd3WCWQd3BKfVdQJIYVdQJ&42nWB1CdP2G%$4BO$4BO";
  localStorage.setItem("emp", role);
};

const handleATChange = () => {
  const role =
    "WQd3W2G1CdP2$sOTqXGQd3yMTcVdd/C$sOTqXWkvM1J54C$s2nWBMTcVjPVdQ1CQd3f0BwwdqBWBKfVJO$4BO";
  localStorage.setItem("emp", role);
};

function Sidebar({ openSidebarToggle, OpenSidebar, setAuth }) {
  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("emp_role");

      setAuth(false);
      window.location.reload();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          {/* <BsCart3 className="icon_header" /> */}
          <div className="img-container">
            <img className="img" src={Logo} alt="" />
          </div>
          <div className="shop">INNOVATO</div>
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>
      <hr className="divider" />
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <a href="/addash" onClick={() => handleRoleChange()}>
            <RxDashboard className="icon" />
            Dashboard
          </a>
        </li>
        <div className="sidebar">
          <ul className="sidebar-list">
            <li className="sidebar-list-item">
              <a href="/addash/otrequest" onClick={() => handleOTChange()}>
                <FcOvertime className="icon" /> OT Request{" "}
              </a>
            </li>
          </ul>
        </div>
        <li className="sidebar-list-item">
          <a href="/addash/apptech" onClick={() => handleATChange()}>
            <MdOutlinePeopleAlt className="icon" /> AppTech
          </a>
        </li>
        {/* <li className="sidebar-list-item">
          <a href="">
            <FcOvertime className="icon" />
            test
          </a>
        </li> */}

        {/* <li className="sidebar-list-item">
          <a href="">
            <BsListCheck className="icon" /> test
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="">
            <BsMenuButtonWideFill className="icon" /> test
          </a>
        </li> */}
        <li className="sidebar-list-item">
          <a href="#2" onClick={(e) => logout(e)}>
            <BsFillGearFill className="icon" /> Logout
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
