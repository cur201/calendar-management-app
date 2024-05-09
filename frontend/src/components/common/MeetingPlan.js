import * as React from 'react';

export default class MeetingPlan extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data : []
        };
    };

    

    render() {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                hello meeting plan
            </div>
        );
    }

}