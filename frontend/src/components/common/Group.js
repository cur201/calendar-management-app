// src/components/common/Group.js

import React from "react";
import { request, setAuthToken } from "../../axios_helper";
import Modal from "react-modal";
import GroupDetailsModal from "./modal/GroupDetailsModal";
import "../teacher_view/Student.css";

class Group extends React.Component {
    state = {
        groupData: [],
        isGroupDetailModalOpen: false,
        selectedGroupUsers: [],
        selectedGroupMeetings: [],
        selectedGroupId: null,
    };

    async processGroupData(groupData) {
        const processedData = await Promise.all(
            groupData.map(async (group) => {
                const leaderResponse = await request("GET", `/common/get-user/${group.leaderId}`);
                const meetingPlanResponse = await request("GET", `/common/get-meeting-plan/${group.meetingPlanId}`);

                return {
                    id: group.id,
                    meetingPlanName: meetingPlanResponse.data.name,
                    leaderName: leaderResponse.data.name,
                    leaderId: group.leaderId,
                    classId: group.classId,
                    courseName: group.courseName,
                    projectName: group.projectName,
                };
            })
        );

        this.setState({ groupData: processedData });
    }

    async openGroupDetailModal(groupId) {
        this.setState({
            selectedGroupId: groupId,
            isGroupDetailModalOpen: true,
        });
    }

    async fetchGroupMeetings(groupId) {
        // Placeholder method to be overridden by subclasses
        throw new Error("fetchGroupMeetings method must be overridden in subclass");
    }

    closeGroupDetailModal = () => {
        this.setState({ isGroupDetailModalOpen: false });
    };

    render() {
        const { isGroupDetailModalOpen, selectedGroupId, groupData } = this.state;
        return (
            <div className="view-container">
                <div className="top-controls">
                    <h1>Student groups</h1>
                </div>
                <table className="student-table rounded-more">
                    <thead>
                        <tr>
                            <th>Meeting Plan Name</th>
                            <th>Leader Name</th>
                            <th>Class ID</th>
                            <th>Course Name</th>
                            <th>Project Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.groupData.map((group) => (
                            <tr key={group.id} onClick={() => this.openGroupDetailModal(group.id)}>
                                <td>{group.meetingPlanName}</td>
                                <td>{group.leaderName}</td>
                                <td>{group.classId}</td>
                                <td>{group.courseName}</td>
                                <td>{group.projectName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isGroupDetailModalOpen && (
                    <GroupDetailsModal groupId={selectedGroupId} groupData={groupData} fetch={this.fetchGroupMeetings} onClose={this.closeGroupDetailModal} />
                )}
            </div>
        );
    }
}

export default Group;
