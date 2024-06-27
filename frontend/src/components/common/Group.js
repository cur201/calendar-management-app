// src/components/common/Group.js

import React from 'react';
import { request, setAuthToken } from '../../axios_helper';
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
        isAddToGroupModalOpen: false,
        availableGroups: [],
        selectedUserIdForAdd: null,
    };

    async processGroupData(groupData) {
        const processedData = await Promise.all(
            groupData.map(async (group) => {
                const leaderResponse = await request("GET", `/common/get-user/${group.leaderId}`);
                const meetingPlanResponse = await request("GET", `/common/get-meeting-plan/${group.meetingPlanId}`);
                const leaderDetailResponse = await request("GET", `/common/get-student-project-detail/${group.leaderDetailId}`);
                const groupUsersResponse = await request("GET", `/common/get-group-user-in-group/${group.id}`);

                if (groupUsersResponse.data.length === 0) {
                    return null;
                }

                return {
                    id: group.id,
                    meetingPlanId: group.meetingPlanId,
                    meetingPlanName: meetingPlanResponse.data.name,
                    leaderName: leaderResponse.data.name,
                    leaderId: leaderDetailResponse.data.studentCode,
                    classId: leaderDetailResponse.data.classId,
                    courseName: leaderDetailResponse.data.courseName,
                    projectName: leaderDetailResponse.data.projectName,
                };
            })
        );

        const filteredData = processedData.filter(group => group !== null);

        console.log('Filtered Data:', filteredData);

        this.setState({ groupData: filteredData });
    }

    async openGroupDetailModal(groupId) {
        const groupUsersResponse = await request("GET", `/common/get-group-user-in-group/${groupId}`);
        const groupUsers = groupUsersResponse.data;

        const groupUsersWithNames = await Promise.all(groupUsers.map(async (groupUser) => {
            const userResponse = await request("GET", `/common/get-user/${groupUser.userId}`);
            return {
                ...groupUser,
                userName: userResponse.data.name,
                role: groupUser.userId === this.state.groupData.find(group => group.id === groupId).leaderId ? 'Leader' : 'Member',
                groupUserId: groupUser.id
            };
        }));

        const groupMeetingsResponse = await this.fetchGroupMeetings(groupId);
        const groupMeetings = groupMeetingsResponse.data;

        this.setState({
            selectedGroupUsers: groupUsersWithNames,
            selectedGroupMeetings: groupMeetings,
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

    openAddToGroupModal = async (userId) => {
        const selectedGroup = this.state.groupData.find(group => group.id === this.state.selectedGroupId);
        if (!selectedGroup) {
            console.error('Selected group not found.');
            return;
        }
    
        const { meetingPlanId } = selectedGroup;
        if (!meetingPlanId) {
            console.error('Meeting Plan ID is undefined.');
            return;
        }
    
        try {
            const response = await request("GET", `/teacher/get-group-by-meeting-plan-id/${meetingPlanId}`);
            const availableGroups = response.data;
    
            const groupsWithLeaderInfo = await Promise.all(availableGroups.map(async (group) => {
                const leaderResponse = await request("GET", `/common/get-user/${group.leaderId}`);
                const specificGroupUserResponse = await request("GET", `/common/get-specific-group-user/${group.leaderId}/${group.id}`);
                console.log(`Leader info for group ${group.id}:`, leaderResponse.data);
                console.log(`Specific group user info for leader ${group.leaderId} in group ${group.id}:`, specificGroupUserResponse.data);
                const groupUsersResponse = await request("GET", `/common/get-group-user-in-group/${group.id}`);
                const groupUsers = groupUsersResponse.data;
                console.log(`Group users for group ${group.id}:`, groupUsers);
                if (groupUsers.length === 0) {
                    return null;
                }
                return {
                    ...group,
                    leaderName: leaderResponse.data.name,
                    studentId: specificGroupUserResponse.data.studentId,
                };
            }));

            const filteredGroups = groupsWithLeaderInfo.filter(group => group !== null);
            console.log('Filtered groups:', filteredGroups);
    
            this.setState({ availableGroups: groupsWithLeaderInfo, isAddToGroupModalOpen: true, selectedUserIdForAdd: userId });
        } catch (error) {
            console.error('Error fetching available groups:', error);
        }
    }

    closeAddToGroupModal = () => {
        this.setState({ isAddToGroupModalOpen: false });
    }

    handleAddToGroup = async (groupId) => {
        const group = this.state.availableGroups.find(group => group.id === groupId);
        const user = this.state.selectedGroupUsers.find(user => user.userId === this.state.selectedUserIdForAdd);

        const requestBody = {
            id: user.groupUserId,  
            userId: user.userId,
            studentId: user.studentId,
            groupId: this.state.selectedGroupId,  
        };

        await request("POST", "/common/update-group-user", requestBody);

        this.setState({ isAddToGroupModalOpen: false });
        this.openGroupDetailModal(this.state.selectedGroupId);
    }

    renderTopControls() {
        return (
            <div className="top-controls">
                <h1>Student groups</h1>
                <div className="spacing" />
            </div>
        );
    }

    render() {
        const { isGroupDetailModalOpen, selectedGroupId, groupData } = this.state;
        return (
            <div className="view-container">
                {this.renderTopControls()}
                <table className="student-table rounded-more">
                    <thead>
                        <tr>
                            <th>Leader Name</th>
                            <th>Leader ID</th>
                            <th>Class ID</th>
                            <th>Course Name</th>
                            <th>Project Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupData.map((group) => (
                            group && (
                                <tr key={group.id} onClick={() => this.openGroupDetailModal(group.id)}>
                                    <td>{group.leaderName}</td>
                                    <td>{group.leaderId}</td>
                                    <td>{group.classId}</td>
                                    <td>{group.courseName}</td>
                                    <td>{group.projectName}</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>

                <Modal
                    isOpen={this.state.isAddToGroupModalOpen}
                    onRequestClose={this.closeAddToGroupModal}
                    contentLabel="Add to Group"
                >
                    <h2>Add to Group</h2>
                    <button onClick={this.closeAddToGroupModal}>Close</button>
                    <table className="available-groups-table">
                        <thead>
                            <tr>
                                <th>Leader Name</th>
                                <th>Leader ID</th>
                                <th>Class ID</th>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Project Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.availableGroups.map(group => (
                                <tr key={group.id}>
                                    <td>{group.leaderName}</td>
                                    <td>{group.studentId}</td>
                                    <td>{group.classId}</td>
                                    <td>{group.courseId}</td>
                                    <td>{group.courseName}</td>
                                    <td>{group.projectName}</td>
                                    <td>
                                        <button onClick={() => this.handleAddToGroup(group.id)}>Accept</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal>
                {isGroupDetailModalOpen && (
                    <GroupDetailsModal groupId={selectedGroupId} groupData={groupData} fetch={this.fetchGroupMeetings} onClose={this.closeGroupDetailModal} />
                )}
            </div>
        );
    }
}

export default Group;
