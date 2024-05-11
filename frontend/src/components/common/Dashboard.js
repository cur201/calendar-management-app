import './Dashboard.css'
import * as React from 'react';
import { NavItem, NavBar } from './NavBar';
import NavWindow from './NavWindow';


export default class Dashboard extends React.Component {
    constructor(props, items) {
        super(props);
        this.state = {
            componentToShow: "meetingplan"
        };
        this.items = items
        console.log(items)
    };

    render() {
        return (
            <div className="nav-container">
                <NavBar items={this.items} />
                <div className="nav-window-container acrylic">
                    <NavWindow />
                </div>

            </div>
        );
    }
}
