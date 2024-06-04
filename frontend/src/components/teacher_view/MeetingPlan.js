import React from 'react';
import { request, setAuthToken } from '../../axios_helper';
import MeetingPlan from '../common/MeetingPlan';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus, faSearch
} from "@fortawesome/free-solid-svg-icons";
import "./MeetingPlan.css";
import CreatePlanModal from './CreatePlanModal';
import { ToastContainer } from 'react-toastify';


export default class TeacherMeetingPlan extends MeetingPlan{

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            searchTerm: '',
            showPopup: false,
        };
    }

    componentDidMount() {
        this.fetchMeetingPlans();
    }

    fetchMeetingPlans = () => {
        request(
            "GET",
            `/teacher/get-plans`,
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

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    }

    handleSearchSubmit = () => {
        const { searchTerm } = this.state;
        const ownerUserId = localStorage.getItem("userId");
        console.log("Searching for:", searchTerm, "with ownerUserId:", ownerUserId);

        request(
            "GET",
            `/teacher/search-meeting-plan-teacher?query=${searchTerm}&ownerUserId=${ownerUserId}`,
            null,
        ).then((response) => {
            this.setState({ data: response.data });
        }).catch((error) => {
            if (error.response.status === 401) {
                setAuthToken(null);
            } else {
                this.setState({ data: error.response.code });
            }
        });
    }

    handleCreateNew = () => {
        console.log("Create new meeting plan");
        this.setState({ showPopup: true });
    }

    closePopup = () => {
        this.setState({ showPopup: false });
    }

    handleSuccess = () => {
        this.fetchMeetingPlans();
    }

    render() {
        const { searchTerm, showPopup } = this.state;

        return (
            <div>
                <div className="top-controls">
                    <h1>Meeting plans</h1>
                    <div className='spacing'></div>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={this.handleSearchChange}
                        />
                        <button onClick={this.handleSearchSubmit} className='circle-button'><FontAwesomeIcon icon={faSearch} /></button>
                    </div>
                    <button className="create-button circle-button" onClick={this.handleCreateNew}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                    {showPopup && <CreatePlanModal onClose={this.closePopup} onSuccess={this.handleSuccess} />}
                </div>
                {super.render()}
                <ToastContainer />
            </div>
        );
    }
}
