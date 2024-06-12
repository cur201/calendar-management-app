// import React from 'react';
import { request, setAuthToken } from "../../../axios_helper";
import Group from "../Group";

class TeacherGroup extends Group {
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
}

export default TeacherGroup;
