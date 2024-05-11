import * as React from 'react';


export default class NavWindow extends React.Component {
    constructor(props, items) {
        super(props);
        this.items = items
        this.state = {
            componentToShow: "meetingplan"
        };
    };

    render() {
        return (
            <div>
                <h1>Nav Window</h1>
            </div>
        );
    }
}
