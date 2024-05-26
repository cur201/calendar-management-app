import * as React from 'react';
import WelcomeContent from './WelcomeContent';
import AuthContent from './AuthContent';
import LoginForm from './LoginForm';
import Buttons from './Buttons';
import { request, setAuthToken } from '../../axios_helper';
import Navigator from '../common/Navigator';
import MeetingPlan from '../common/MeetingPlan';

export default class AppContent extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            componentToShow: "welcome"
        }
    };

    login = () => {
        this.setState({componentToShow: "login"});
    };

    logout = () => {
        setAuthToken(null);
        this.setState({componentToShow: "welcome"});
    };

    onLogin = (e, username, password) => {
        e.preventDefault();
        request(
            "POST",
            `/login`,
            { login: username, password: password}
        ).then((Response) => {
            this.setState({componentToShow: "navigator"});
            setAuthToken(Response.data.token);
        }).catch((error) => {
            setAuthToken(null);
            this.setState({componentToShow: "welcome"})
        });
    };

    onRegister = (e, name, username, password, role) => {
        e.preventDefault();
        request("POST",
            `/register`,
            {
                name: name, 
                login: username, 
                password: password,
                role: role
            }
        ).then((Response) => {
            this.setState({componentToShow: "message"});
            setAuthToken(Response.data.token);
        }).catch((error) => {
            setAuthToken(null);
            this.setState({componentToShow: "welcome"})
        });
    };

    render () {
        return (
            <div>
                <Buttons login = {this.login} logout={this.logout}
                />
                {this.state.componentToShow === "navigator" && <Navigator/>}
                {this.state.componentToShow === "meetingplan" && <MeetingPlan/>}
                {this.state.componentToShow === "welcome" && <WelcomeContent/>}
                {this.state.componentToShow === "message" && <AuthContent/>}
                {this.state.componentToShow === "login" && <LoginForm onLogin={this.onLogin} onRegister={this.onRegister}/>}
            </div>
        );
    };
}