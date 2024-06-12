import React from "react";
import { useParams } from "react-router-dom";
import { NavItem } from "../NavBar";
import Dashboard from "../Dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import MeetingPlanDetails from "./MeetingPlanDetails";
import MeetingPlanStudentGroups from "./MeetingPlanStudentGroups";

class _MeetingPlanDashboard extends Dashboard {
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.componentToShow !== prevState.componentToShow) {
            return { componentToShow: nextProps.componentToShow };
        }
        return null;
    }

    getNavItems() {
        return [
            <NavItem
                icon={<FontAwesomeIcon icon={faCircleInfo} />}
                title={"Details"}
                href={"/dashboard/meeting-plans/" + this.props.planId + "/details"}
            />,
            <NavItem
                icon={<FontAwesomeIcon icon={faPeopleGroup} />}
                title={"Student groups"}
                href={"/dashboard/meeting-plans/" + this.props.planId + "/student-groups"}
            />,
        ];
    }

    getContent() {
        console.log(this.props.componentToShow)
        switch (this.props.componentToShow) {
            case "meeting-plan-details":
                return <MeetingPlanDetails planId={this.props.planId} />;
            case "meeting-plan-student-groups":
                return <MeetingPlanStudentGroups planId={this.props.planId} />;

            default:
                return <div>Select a component to show</div>;
        }
    }
}

const MeetingPlanDashboard = ({componentToShow}) => {
    const { planId } = useParams();
    return <_MeetingPlanDashboard planId={planId} componentToShow={componentToShow}/>;
};

export default MeetingPlanDashboard;
