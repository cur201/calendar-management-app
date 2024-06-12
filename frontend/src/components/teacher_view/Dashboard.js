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
import TeacherMeetingPlan from "./MeetingPlan";
import Event from "./Event";
import Student from "./Student";
import Group from "./Group";

const meetingIcon = <FontAwesomeIcon icon={faCalendarDays} />;
const eventIcon = <FontAwesomeIcon icon={faCalendarCheck} />;
const studentIcon = <FontAwesomeIcon icon={faUserGroup} />;
const notiIcon = <FontAwesomeIcon icon={faBell} />;

export default class TeacherDashboard extends Dashboard {
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
        icon={studentIcon}
        title={"Groups"}
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
    console.log("SHOW CONTENT");
    switch (this.props.componentToShow) {
      case "meeting-plans":
        return <TeacherMeetingPlan />;
      case "scheduled-event":
        return <Event />;
      case "students":
        return <Student />
      case "groups":
        return <Group />

      default:
        return <div>Select a component to show</div>;
    }
  }
    // render () {
    //     return (
    //         <Dashboard items={this.items} componentToShow={this.state.componentToShow} />
    //     );
    // };
}
