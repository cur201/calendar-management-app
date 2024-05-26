import React from 'react';
import { NavItem } from '../common/NavBar';
import Dashboard from '../common/Dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faCalendarCheck, faUserGroup, faBell } from '@fortawesome/free-solid-svg-icons'


const meetingIcon = <FontAwesomeIcon icon={faCalendarDays} />
const eventIcon = <FontAwesomeIcon icon={faCalendarCheck} />
const studentIcon = <FontAwesomeIcon icon={faUserGroup} />
const notiIcon = <FontAwesomeIcon icon={faBell} />


export default class StudentDashboard extends Dashboard {
    constructor(props) {
        super(props);
        const items = [
            <NavItem icon={meetingIcon} title={"Meeting plans"} href = "/dashboard/meeting-plans"/>,
            <NavItem icon={eventIcon} title={"Scheduled events"} href="/dashboard/events"/>,
            <NavItem icon={studentIcon} title={"Students"} href="/dashboard/students"/>,
            <NavItem icon={notiIcon} title={"Notifications"} href="/dashboard/notifications"/>,
        ];

        // this.state = {
        //     componentToShow: props.componentToShow  || "meetingplan"
        // };
        this.items = items;
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.componentToShow !== prevState.componentToShow) {
            return { componentToShow: nextProps.componentToShow };
        }
        return null;
    }

    render () {
        return (
            <Dashboard items={this.items} componentToShow={this.state.componentToShow} />
        );
    };
}
