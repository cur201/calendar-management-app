import "./NavBar.css";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faIdCard } from "@fortawesome/free-solid-svg-icons";

export const NavItem = ({ icon, title, href }) => {
    return (
        <NavLink to={href} className={({ isActive }) => `nav-item rounded-more ${isActive ? "active" : ""}`}>
            <span className="icon">{icon}</span>
            <span className="title">{title}</span>
        </NavLink>
    );
};

export class NavBar extends React.Component {
    render() {
        const name = window.localStorage.getItem("userName");
        let role = window.localStorage.getItem("userRole");
        role = role[0].toUpperCase() + role.slice(1).toLowerCase();
        return (
            <div className="navbar flex">
                <div id="logo">
                    <h3>Meeting Manager</h3>
                    <span style={{ fontSize: ".8rem" }}>{role + " view"}</span>
                </div>
                <div className="line-break"></div>
                <div className="line-break"></div>
                <div className="navbar-seperator">MENU</div>
                {this.props.items}
                <div className="spacing"></div>
                <NavItem icon={<FontAwesomeIcon icon={faIdCard} />} title={name} href="/profile" />
                <NavItem icon={<FontAwesomeIcon icon={faRightFromBracket} />} title={"Log out"} href="/logout" />
            </div>
        );
    }
}
