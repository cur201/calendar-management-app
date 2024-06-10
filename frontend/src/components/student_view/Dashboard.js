import React from "react";
import { NavItem } from "../common/NavBar";
import Dashboard from "../common/Dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCalendarCheck,
  faUserGroup,
  faBell,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import StudentMeetingPlan from "./MeetingPlan";
import Event from "./Event";
import Student from "./Student";

const meetingIcon = <FontAwesomeIcon icon={faCalendarDays} />;
const eventIcon = <FontAwesomeIcon icon={faCalendarCheck} />;
const studentIcon = <FontAwesomeIcon icon={faUserGroup} />;
const notiIcon = <FontAwesomeIcon icon={faBell} />;
const logoutIcon = <FontAwesomeIcon icon={faRightFromBracket} />;


export default class StudentDashboard extends Dashboard {

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.componentToShow !== prevState.componentToShow) {
            return { componentToShow: nextProps.componentToShow };
        }
        return null;
    }

    getNavItems() {
        return [
            <NavItem
            icon={meetingIcon}
            title={"Meeting plans"}
            href="/dashboard/meeting-plans"
            />,
            <NavItem
            icon={eventIcon}
            title={"Scheduled events"}
            href="/dashboard/events"
            />,
            <NavItem
            icon={studentIcon}
            title={"Students"}
            href="/dashboard/students"
            />,
            <NavItem
            icon={notiIcon}
            title={"Notifications"}
            href="/dashboard/notifications"
            />,
            <NavItem icon={logoutIcon} title={"Log out"} href="/logout" />,
        ];
    }

    getContent() {
    console.log("SHOW CONTENT");
    switch (this.props.componentToShow) {
        case "meeting-plans":
        return <StudentMeetingPlan />;
        case "scheduled-event":
        return <Event />;
        case "students":
        return <Student />

        default:
        return <div>Select a component to show</div>;
    }

    // render () {
    //     return (
    //         <Dashboard items={this.items} componentToShow={this.state.componentToShow} />
    //     );
    // };
}}
