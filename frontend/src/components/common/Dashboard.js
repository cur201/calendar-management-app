import "./Dashboard.css";
import * as React from "react";
import { NavBar } from "./NavBar";
import NavWindow from "./NavWindow";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentToShow: props.componentToShow,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.componentToShow !== this.props.componentToShow) {
            this.setState({ componentToShow: this.props.componentToShow });
        }
    }

    getNavItems() {}

    getContent() {}

    render() {
        console.log(this.getContent());
        return (
            <div className="nav-container">
                <NavBar items={this.getNavItems()} />
                <div className="nav-window-container bg-body border-light rounded soft-shadow">
                    <NavWindow componentToShow={this.getContent()} />
                </div>
            </div>
        );
    }
}
