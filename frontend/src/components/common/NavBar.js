import "./NavBar.css";
import * as React from "react";
import { NavLink } from "react-router-dom";

export const NavItem = ({ icon, title, href }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `nav-item rounded-more ${isActive ? "active" : ""}`
      }
    >
      <span className="icon">{icon}</span>
      <span className="title">{title}</span>
    </NavLink>
  );
};

export class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar flex">
        <div className="navbar-seperator">MENU</div>
        {this.props.items}
      </div>
    );
  }
}
