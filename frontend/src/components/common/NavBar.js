import "./NavBar.css"
import * as React from 'react';


export const NavItem = ({ icon, title }) => {
    return (
        <div className='nav-item'>
            <span className="icon">{icon}</span>
            <span className='title'>{title}</span>
        </div>
    )
}


export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.items = props.items
        this.state = {
            componentToShow: "meetingplan"
        }
    }

    render() {
        return (
            <div>
                <div>
                    {this.items}
                </div>
            </div>
        );
    }
}
