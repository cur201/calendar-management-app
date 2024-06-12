import React from "react";
import { request, setAuthToken } from "../../axios_helper";
import MeetingPlan from "../common/MeetingPlan";
import "./MeetingPlan.css";
import CreatePlanModal from "./modals/CreatePlanModal";
import { ToastContainer } from "react-toastify";

export default class TeacherMeetingPlan extends MeetingPlan {
    constructor(props) {
        super(props);
        this.state.showPopup = false;
        this.readOnly = false;
        this.searchable = true;

    }

    fetchMeetingPlans() {
        request("GET", `/teacher/get-plans`, null)
            .then((response) => {
                console.log(response.data)
                this.setState({ data: response.data }, this.updateShowPlans);
            })
            .catch((error) => {
                console.log(error)
                if (error.response.status === 401) {
                    setAuthToken(null);
                } else {
                    this.setState({ data: error.response.code });
                }
            });
    };

    handleCreateNew = () => {
        console.log("Create new meeting plan");
        this.setState({ showPopup: true });
    };

    closePopup = () => {
        this.setState({ showPopup: false });
    };

    handleSuccess = () => {
        this.fetchMeetingPlans();
    };

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    };

    handleSearchSubmit = () => {
        const { searchTerm } = this.state;
        const ownerUserId = localStorage.getItem("userId");
        console.log("Searching for:", searchTerm, "with ownerUserId:", ownerUserId);

        request("GET", `/teacher/search-meeting-plan-teacher?query=${searchTerm}&ownerUserId=${ownerUserId}`, null)
            .then((response) => {
                this.setState({ data: response.data });
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setAuthToken(null);
                } else {
                    this.setState({ data: error.response.code });
                }
            });
    };

    content() {
        const { searchTerm, showPopup } = this.state;
        return (
            <>
            {showPopup && <CreatePlanModal onClose={this.closePopup} onSuccess={this.handleSuccess} />}
            <ToastContainer />
            </>
        )
    }

}
