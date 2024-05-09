import * as React from 'react';
import CustomNav from './CustomNav';
import MeetingPlan from './MeetingPlan';
import '../../styles.scss';

export default class Navigator extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            componentToShow: "meetingplan"
        };
    };

    render() {
        return (
            <div>
                <div>
                    <CustomNav
                        li={[
                            ["Meeting Plan", "null"],
                            ["Scheduled Event", "null"],
                            ["Student", "null"],
                            ["Notify", "null"]
                        ]}
                        defaultItem={"Meeting Plan"}
                    />
                </div>
                <div>
                    {this.state.componentToShow === "meetingplan" && <MeetingPlan/>}
                </div>
            </div>
        );
    }
}