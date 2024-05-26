import * as React from 'react';
import MeetingPlan from './MeetingPlan';
import Event from './Event';
import { TopBar } from './TopBar';


export default class NavWindow extends React.Component {
    render() {
        return (
            <div className="nav-window">
                <TopBar />
                {this.props.componentToShow}
            </div>
        );
    }
}
