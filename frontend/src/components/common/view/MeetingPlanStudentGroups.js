import React from 'react';
import { request, setAuthToken } from "../../../axios_helper";
import Group from "../Group";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CreatePlanModal from "../../teacher_view/modals/CreatePlanModal";
import AddStudentToMeetingPlanModal from "../modal/AddStudentToMeetingPlanModal";

class TeacherGroup extends Group {
    constructor(props) {
        super(props);
        this.state.showPopup = false;
    }

    componentDidMount() {
        try {
            request("GET", `/teacher/get-group-by-meeting-plan-id/${this.props.planId}`, null)
                .then((response) => {
                    const groupData = response.data;
                    this.processGroupData(groupData);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        setAuthToken(null);
                    } else {
                        this.setState({ data: error.response.code });
                    }
                });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async fetchGroupMeetings(groupId) {
        return await request("GET", `/teacher/get-meeting-by-group-id/${groupId}`);
    }

    addNewStudent = async () => {
        this.setState({ showPopup: true });
    };

    closePopup = () => {
        this.setState({ showPopup: false });
    };



    renderTopControls() {
        const { showPopup } = this.state;
        const { planId } = this.props;
        return (
            <div className="top-controls">
                <h1>Student groups</h1>
                <div className="spacing" />
                <button className="create-button circle-button" onClick={this.addNewStudent}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>

                <>
                    {showPopup && <AddStudentToMeetingPlanModal planId={planId} onClose={this.closePopup} onSuccess={this.componentDidMount} />}
                </>
            </div>
        );
    }
}

export default TeacherGroup;
