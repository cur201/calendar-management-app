import * as React from 'react';
import { request, setAuthToken } from '../../axios_helper';

export default class Event extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            currentPage: 0
        };
    };

    render() {
        return(
            <h1>This is event</h1>
        );
    }
}