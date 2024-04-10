import * as React from "react";

import { request } from "../axios_helper";

export default class AuthContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : []
        };
    };

    componentDidMount() {
        request(
            "GET",
            "/message",
            {}
        ).then((response) => {
            console.log("pass response");
            console.log("Response data: ", response.data); 
            if (Array.isArray(response.data)) { 
                this.setState({data: response.data});
            } else {
                console.error("Response data is not an array.");
            }
        }).catch((error) => {
            console.error("Error fetching data:", error);
        });
    };
    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="col-4">
                    <div className="card" style={{width: "18rem"}}>
                        <div className="card-body">
                            <h5 className="card-title">Backend response</h5>
                            <p className="card-text">Content:</p>
                            <ul>
                                {this.state.data && this.state.data
                                    .map((line) =>
                                        <li key={line}>{line}</li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

