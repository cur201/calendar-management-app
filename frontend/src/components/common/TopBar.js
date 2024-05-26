import "./TopBar.css"
import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'



const drawerIcon = <FontAwesomeIcon icon={faBars} />


export class TopBar extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.items = props.items
    //     this.state = {
    //         componentToShow: "meetingplan"
    //     }
    // }

    render() {
        return (
            <div className="topbar flex bg-light">
                <button id="toggle-navbar">{drawerIcon}</button>
                <div className="topbar-title">Meeting plans</div>
                <div className="spacing"></div>
                <div className="">Account</div>
            </div>
        );
    }
}
