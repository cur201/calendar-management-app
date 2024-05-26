import "./NavBar.css"
import * as React from 'react';
import { NavLink } from 'react-router-dom';


export const NavItem = ({ icon, title, href }) => {
    return (
        // <div className='nav-item'>
        //     <Link to={href}>
        //         <span className="icon">{icon}</span>
        //         <span className='title'>{title}</span>
        //     </Link>
        // </div>
        <NavLink
            to={href}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
            <span className="icon">{icon}</span>
            <span className='title'>{title}</span>
        </NavLink>
    )
}


export class NavBar extends React.Component {
    render() {
        return (
            <div>
                <div>
                    {this.props.items}
                </div>
            </div>
        );
    }
}
