import React from 'react';
import { request, setAuthToken } from '../../axios_helper';
import MeetingPlan from '../common/MeetingPlan';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus, faSearch
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from 'react-toastify';

export default class StudentMeetingPlan extends MeetingPlan{
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            searchTerm: '',
        };
        this.readOnly = true;
    }

    fetchMeetingPlans = () => {
        const studentId = window.localStorage.getItem("userId");
        request(
            "GET",
            `/student/get-meeting-plan-by-student-id/${studentId}`,
            null,
        ).then((response) => {
            this.setState({data: response.data}, this.updateShowPlans)
        }).catch((error) => {
            if (error.response.status === 401) {
                setAuthToken(null);
            } else {
                this.setState({data: error.response.code})
            }
        });
    }

}
