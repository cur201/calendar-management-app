import React from "react";
import { request, setAuthToken } from "../../../axios_helper";
import PopUpModal from "../../common/PopUpModal";
import "./ButtonDropdown.css";

class GroupDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupData: this.props.groupData,
            selectedGroupUsers: [],
            selectedGroupMeetings: [],
            selectedGroupId: null,
            showOptionsPopup: false,
            selectedUserId: null,
            showAddMemberDropdown: false,
            addMemberData: [],
        };
        this.fetchGroupMeetings = this.props.fetch
    }

    async componentDidMount() {
        const groupId = this.props.groupId;
        try {
            const groupUsersResponse = await request("GET", `/common/get-group-user-in-group/${groupId}`);
            const groupUsers = groupUsersResponse.data;
    
            // Logging groupId
            console.log('Group ID:', groupId);
    
            const groupUsersWithNames = await Promise.all(
                groupUsers.map(async (groupUser) => {
                    const userResponse = await request("GET", `/common/get-user/${groupUser.userId}`);
                    const user = userResponse.data;

                    const studentDetail = await request("GET", `/common/get-student-project-detail/${groupUser.studentDetailId}`);
                    const studentDetailInfo = studentDetail.data;

                    const selectedGroup = this.state.groupData.find((group) => group.id === groupId);
                    const leaderId = selectedGroup ? selectedGroup.leaderId : null;
    
                    return {
                        ...groupUser,
                        userName: user.name,
                        studentId: studentDetailInfo.studentCode,
                        role: groupUser.userId === leaderId ? "Leader" : "Member",
                    };
                })
            );
    
            const groupMeetingsResponse = await this.fetchGroupMeetings(groupId);
            const groupMeetings = groupMeetingsResponse.data;
    
            this.setState({
                selectedGroupUsers: groupUsersWithNames,
                selectedGroupMeetings: groupMeetings,
                selectedGroupId: groupId,
            });
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    }

    handleOptionClick = (userId) => {
        this.setState((prevState) => ({
            showOptionsPopup: !prevState.showOptionsPopup,
            selectedUserId: userId,
        }));
    };

    handleCloseOptionsPopup = () => {
        this.setState({ showOptionsPopup: false, selectedUserId: null });
    };

    handleAddMemberClick = async () => {
        try {
            const selectedGroup = this.state.groupData.find(group => group.id === this.state.selectedGroupId);
            console.log(selectedGroup);
            if (!selectedGroup) {
                console.error('Selected group not found.');
                return;
            }

            const { meetingPlanId } = selectedGroup;
            if (!meetingPlanId) {
                console.error('Meeting Plan ID is undefined.');
                return;
            }

            const response = await request("GET", `/teacher/get-group-by-meeting-plan-id/${meetingPlanId}`);
            const groups = response.data;

            let addMemberData = [];

            for (const group of groups) {
                const groupUsersResponse = await request("GET", `/common/get-group-user-in-group/${group.id}`);
                const groupUsers = groupUsersResponse.data;

                for (const groupUser of groupUsers) {
                    const userResponse = await request("GET", `/common/get-user/${groupUser.userId}`);
                    const user = userResponse.data;
                    const studentDetailId = groupUser.studentDetailId;
                    const studentDetailInfo = await request("GET", `/common/get-student-project-detail/${studentDetailId}`);
                    const studentDetail = studentDetailInfo.data;

                    addMemberData.push({
                        groupUserId: groupUser.id,
                        userId: groupUser.userId,
                        groupId: groupUser.groupId,
                        classId: studentDetailInfo.data.classId,
                        projectName: studentDetailInfo.data.projectName,
                        studentDetailId: groupUser.studentDetailId,
                        studentId: studentDetail.studentCode,
                        name: user.name,
                        email: user.username,
                    });
                }
            }

            this.setState({ addMemberData, showAddMemberDropdown: true });
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    };

    handleAddMemberSelection = async (user) => {
        const selectedGroup = this.state.groupData.find(group => group.id === this.state.selectedGroupId);
    
        if (!selectedGroup) {
            console.error('Selected group not found.');
            return;
        }

        if (user.classId !== selectedGroup.classId) {
            console.error('Class ID does not match, cannot merge this user to this group.');
            return;
        }

        if (user.projectName !== selectedGroup.projectName) {
            if (!user.projectName || !selectedGroup.projectName) {
                
            } else {
                console.error('Project name does not match, cannot merge this user to this group.');
                return;
            }
        }
    
        const body = {
            id: user.groupUserId,
            userId: user.userId,
            groupId: selectedGroup.id,
            studentDetailId: user.studentDetailId,
        };
    
        try {
            await request("POST", "/common/update-group-user", body, null);
            window.location.reload(); 
        } catch (error) {
            console.error('Error updating group user:', error);
        }
    };

    handleChangeRoleClick = async (user) => {
        const { selectedUserId, selectedGroupId } = this.state;
        try {
            const selectedGroup = this.state.groupData.find(group => group.id === selectedGroupId);
            if (!selectedGroup) {
                console.error('Selected group not found.');
                return;
            }
    
            if (selectedUserId === selectedGroup.leaderId) {
                const confirm = window.confirm("The account is currently the leader of a group. Continue?");
                if (!confirm) {
                    return;
                }
            }

            const leaderId = user.userId;
            const meetingPlanId = selectedGroup.meetingPlanId;
            const leaderDetailId = user.studentDetailId;
            const getGroup = await request("GET", `/common/get-group-by-student-id-and-meeting-plan/${leaderId}/${meetingPlanId}/${leaderDetailId}`);
            const targetGroup = getGroup.data;

            if (!targetGroup) {
                console.error('Target group not found.');
                return;
            }

            let tempLeaderId;
            let tempDetailId;
            console.log("selected group: ", selectedGroup);
            tempLeaderId = selectedGroup.leaderId;
            tempDetailId = selectedGroup.leaderDetailId;

            const body = {
                id: selectedGroup.id,
                leaderId: targetGroup.leaderId,
                meetingPlanId: selectedGroup.meetingPlanId,
                leaderDetailId: targetGroup.leaderDetailId,
                visible: 1,
            };
            
            const otherbody = {
                id: targetGroup.id,
                leaderId: tempLeaderId,
                meetingPlanId: targetGroup.meetingPlanId,
                leaderDetailId: tempDetailId,
                visible: 1,
            };
            try {
                await request("POST", `/common/update-group`, body);
                await request("POST", `/common/update-group`, otherbody);
                window.location.reload();
            } catch (error) {
                console.error('Error updating leader:', error);
            }
        } catch (error) {
            console.error('Error updating group user:', error);
        }

        this.handleCloseOptionsPopup();
    };

    handleRemoveFromGroupClick = async (user) => {
        const { selectedUserId, selectedGroupId } = this.state;
        try {
            const selectedGroup = this.state.groupData.find(group => group.id === selectedGroupId);
            if (!selectedGroup) {
                console.error('Selected group not found.');
                return;
            }
    
            if (selectedUserId === selectedGroup.leaderId) {
                const confirm = window.confirm("The account is currently the leader of a group. Continue?");
                if (!confirm) {
                    return;
                }
            }

            const leaderId = user.userId;
            const meetingPlanId = selectedGroup.meetingPlanId;
            const leaderDetailId = user.studentDetailId;
            const getGroup = await request("GET", `/common/get-group-by-student-id-and-meeting-plan/${leaderId}/${meetingPlanId}/${leaderDetailId}`);
            const targetGroup = getGroup.data;
            const groupUser = await request("GET", `/common/get-specific-group-user/${user.userId}/${user.groupId}`);
            const targetGroupUser = groupUser.data;

            if (!targetGroup) {
                console.error('Target group not found.');
                return;
            }

            const body = {
                id: targetGroupUser.id,
                userId: user.userId,
                groupId: targetGroup.id,
                studentDetailId: user.studentDetailId,
            };

            try {
                await request("POST", "/common/update-group-user", body, null);
                window.location.reload(); 
            } catch (error) {
                console.error('Error updating group user:', error);
            }
    
        } catch (error) {
            console.error('Error updating group user:', error);
        }

        this.handleCloseOptionsPopup();
    };

    render() {
        const { studentMeetings, studentName } = this.state;

        return (
            <PopUpModal title="Group details" onClose={this.props.onClose}>
                <button onClick={this.handleAddMemberClick}>Add member</button>
                {this.state.showAddMemberDropdown && (
                    <table className="add-member-dropdown">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Group ID</th>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.addMemberData.map((user) => (
                                <tr key={user.groupUserId} onClick={() => this.handleAddMemberSelection(user)}>
                                    <td>{user.userId}</td>
                                    <td>{user.groupId}</td>
                                    <td>{user.studentId}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <h3>Group Users</h3>
                <table className="group-users-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student ID</th>
                            <th>Role</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.selectedGroupUsers.map((user) => (
                            <tr key={user.userId}>
                                <td>{user.userName}</td>
                                <td>{user.studentId}</td>
                                <td>{user.role}</td>
                                <td>
                                    <div className="options-dropdown">
                                        <button onClick={() => this.handleOptionClick(user.userId)}>Options</button>
                                        {this.state.showOptionsPopup && this.state.selectedUserId === user.userId && (
                                            <div className="options-dropdown-content">
                                                <button onClick={() => this.handleChangeRoleClick(user)}>Set as Leader</button>
                                                <button onClick={() => this.handleRemoveFromGroupClick(user)}>Remove from the group</button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3>Group Meetings</h3>
                <table className="group-meetings-table">
                    <thead>
                        <tr>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>State</th>
                            <th>Report</th>
                            <th>Meeting Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.selectedGroupMeetings.map((meeting) => (
                            <tr key={meeting.groupId}>
                                <td>{meeting.startTime}</td>
                                <td>{meeting.endTime}</td>
                                <td>{meeting.state}</td>
                                <td>{meeting.report}</td>
                                <td>{meeting.meetingDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </PopUpModal>
        );
    }
}

export default GroupDetailsModal;
