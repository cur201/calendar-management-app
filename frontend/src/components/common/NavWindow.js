import * as React from 'react';
import MeetingPlan from './MeetingPlan';
import Event from './Event';


export default class NavWindow extends React.Component {
    // constructor(props, items) {
    //     super(props);
    //     this.items = items
    //     this.state = {
    //         componentToShow: "meetingplan"
    //     };
    // };

    // render() {
    //     return (
    //         <div>
    //             <h1>Nav Window</h1>
    //         </div>
    //     );
    // }
    render() {
        let content;
        switch (this.props.componentToShow) {
            case "meetingplan":
                content = <MeetingPlan />;
                break;
            case "scheduled-event":
                content = <Event />;
                break;
            
            default:
                content = <div>Select a component to show</div>;
        }

        return (
            <div className="nav-window">
                {content}
            </div>
        );
    }
}
