import React from "react";
import { NavItem } from "../common/NavBar";
import Dashboard from "../common/Dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCalendarCheck,
  faUserGroup,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import StudentMeetingPlan from "./MeetingPlan";
import Event from "./Event";
import StudentGroup from "./Group";

const meetingIcon = <FontAwesomeIcon icon={faCalendarDays} />;
const eventIcon = <FontAwesomeIcon icon={faCalendarCheck} />;
const studentIcon = <FontAwesomeIcon icon={faUserGroup} />;
const notiIcon = <FontAwesomeIcon icon={faBell} />;


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
            title={"Group"}
            href="/dashboard/groups"
            />,
            <NavItem
            icon={notiIcon}
            title={"Notifications"}
            href="/dashboard/notifications"
            />,
        ];
    }

    getContent() {
    switch (this.props.componentToShow) {
        case "meeting-plans":
        return <StudentMeetingPlan />;
        case "scheduled-event":
        return <Event />;
        case "groups":
        return <StudentGroup />

        default:
        return <div>Select a component to show</div>;
    }}
}
