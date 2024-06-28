// import React from 'react';
import { request, setAuthToken } from '../../axios_helper';
import "../teacher_view/Student.css";
// import Modal from "react-modal";
import Group from '../common/Group';

class StudentGroup extends Group {

    componentDidMount() {
        const studentId = localStorage.getItem("userId");
        request(
            "GET",
            `/common/get-group-by-student-id/${studentId}`,
            null,
        ).then((response) => {
            const groupData = response.data;
            this.processGroupData(groupData);

        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                setAuthToken(null);
            } else {
                this.setState({ data: error.response.code });
            }
        });
    }

    async fetchGroupMeetings(groupId) {
        return await request("GET", `/student/get-meeting-by-group-id-student/${groupId}`);
    }
}

export default StudentGroup;