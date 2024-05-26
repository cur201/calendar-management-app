import './Dashboard.css'
import * as React from 'react';
import { NavItem, NavBar } from './NavBar';
import NavWindow from './NavWindow';


export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentToShow: "meetingplan"
        };
        //this.items = items
        //console.log(items)
    };

    render() {
        return (
            <div className="nav-container">
                <NavBar items={this.props.items} />
                <div className="nav-window-container acrylic">
                    <NavWindow componentToShow={this.state.componentToShow} />
                </div>

            </div>
        );
    }
}
