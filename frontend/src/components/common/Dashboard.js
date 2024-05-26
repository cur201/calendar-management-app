import './Dashboard.css'
import * as React from 'react';
import { NavBar } from './NavBar';
import NavWindow from './NavWindow';


export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentToShow: props.componentToShow || "meetingplan"
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.componentToShow !== this.props.componentToShow) {
            this.setState({ componentToShow: this.props.componentToShow });
        }
    }

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
