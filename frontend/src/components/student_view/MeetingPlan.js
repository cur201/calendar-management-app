import React from 'react';
import { request, setAuthToken } from '../../axios_helper';
import MeetingPlan from '../common/MeetingPlan';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus, faSearch
} from "@fortawesome/free-solid-svg-icons";
import "./MeetingPlan.css";
import { ToastContainer } from 'react-toastify';

export default class StudentMeetingPlan extends MeetingPlan{
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            searchTerm: '',
        };
    }

    componentDidMount() {
        this.fetchMeetingPlans();
    }

    fetchMeetingPlans = () => {
        const studentId = window.localStorage.getItem("userId");
        request(
            "GET",
            `/student/get-meeting-plan-by-student-id/${studentId}`,
            null,
        ).then((response) => {
            this.setState({data: response.data})
        }).catch((error) => {
            if (error.response.status === 401) {
                setAuthToken(null);
            } else {
                this.setState({data: error.response.code})
            }
        });
    }

    render() {
        return (
            <div>
                <div className="top-controls">
                    <h1>Meeting plans</h1>
                    <div className='spacing'></div>
                    {/* // <div className="search-container">
                    //     <input
                    //         type="text"
                    //         placeholder="Search..."
                    //         value={searchTerm}
                    //         onChange={this.handleSearchChange}
                    //     />
                    //     <button onClick={this.handleSearchSubmit} className='circle-button'><FontAwesomeIcon icon={faSearch} /></button>
                    // </div> */}
                    {/* <button className="create-button circle-button" onClick={this.handleCreateNew}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                    {showPopup && <CreatePlanModal onClose={this.closePopup} onSuccess={this.handleSuccess} />} */}
                </div>
                {super.render()}
                <ToastContainer />
            </div>
        );
    }
}
