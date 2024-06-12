// import React from 'react';
import { request, setAuthToken } from '../../axios_helper';
import "../teacher_view/Student.css";
// import Modal from "react-modal";
import Group from '../common/Group';

class TeacherGroup extends Group {

    componentDidMount() {
        try {
            request("GET", "/teacher/get-plans", null)
                .then((response) => {
                    const meetingPlanData = response.data;
                    const firstPlanId = meetingPlanData[0].id;
                    request("GET", `/teacher/get-group-by-meeting-plan-id/${firstPlanId}`, null)
                        .then((response) => {
                            const groupData = response.data;
                            this.processGroupData(groupData);
                        })
                }).catch((error) => {
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
        // Gửi request để lấy các cuộc họp của nhóm dựa trên groupId
        return await request("GET", `/teacher/get-meeting-by-group-id/${groupId}`);
    }
}

export default TeacherGroup;