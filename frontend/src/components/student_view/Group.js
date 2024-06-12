import React from 'react';
import { request, setAuthToken } from '../../axios_helper';
import "../teacher_view/Student.css";
import Modal from "react-modal";

class Group extends React.Component{

    state = {
        groupData: [],
        isGroupDetailModalOpen: false,
        selectedGroupUsers: [],
        selectedGroupMeetings: [],
        selectedGroupId: null,
    };
    componentDidMount() {
        const studentId = localStorage.getItem("userId");
        request(
            "GET",
            `/student/get-group-by-student-id/${studentId}`,
            null,
        ).then((response) => {
            const groupData = response.data;
            this.processGroupData(groupData);

        }).catch((error) => {
            if (error.response.status === 401) {
                setAuthToken(null);
            } else {
                this.setState({ data: error.response.code });
            }
        });
    }
    async processGroupData(groupData) {
        const processedData = await Promise.all(groupData.map(async (group) => {
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
        }));

        this.setState({ groupData: processedData });
    }

    openGroupDetailModal = async (groupId) => {
        const groupUsersResponse = await request("GET", `/common/get-group-user-in-group/${groupId}`);
        const groupUsers = groupUsersResponse.data;

        const groupUsersWithNames = await Promise.all(groupUsers.map(async (groupUser) => {
            const userResponse = await request("GET", `/common/get-user/${groupUser.userId}`);
            return {
                ...groupUser,
                userName: userResponse.data.name,
                role: groupUser.userId === this.state.groupData.find(group => group.id === groupId).leaderId ? 'Leader' : 'Member'
            };
        }));

        const groupMeetingsResponse = await request("GET", `/student/get-meeting-by-group-id-student/${groupId}`);
        const groupMeetings = groupMeetingsResponse.data;

        this.setState({
            selectedGroupUsers: groupUsersWithNames,
            selectedGroupMeetings: groupMeetings,
            selectedGroupId: groupId,
            isGroupDetailModalOpen: true,
        });
    }

    closeGroupDetailModal = () => {
        this.setState({ isGroupDetailModalOpen: false });
    }

    render() {
        return(
            <div className="view-container">
                <div className="top-controls">
                    <h1>Group List</h1>
                </div>
                <table className="student-table rounded-more">
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th>Meeting Plan Name</th>
                            <th>Leader Name</th>
                            <th>Class ID</th>
                            <th>Course Name</th>
                            <th>Project Name</th>
                        </tr>   
                    </thead>
                    <tbody>
                        {this.state.groupData.map(group => (
                            <tr key={group.id} onClick={() => this.openGroupDetailModal(group.id)}>
                                {/* <td>{group.id}</td> */}
                                <td>{group.meetingPlanName}</td>
                                <td>{group.leaderName}</td>
                                <td>{group.classId}</td>
                                <td>{group.courseName}</td>
                                <td>{group.projectName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Modal
                    isOpen={this.state.isGroupDetailModalOpen}
                    onRequestClose={this.closeGroupDetailModal}
                    contentLabel="Group Detail"
                >
                    <h2>Group Detail</h2>
                    <button onClick={this.closeGroupDetailModal}>Close</button>

                    <h3>Group Users</h3>
                    <table className="group-users-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Student ID</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.selectedGroupUsers.map(user => (
                                <tr key={user.userId}>
                                    <td>{user.userName}</td>
                                    <td>{user.studentId}</td>
                                    <td>{user.role}</td>
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
                            {this.state.selectedGroupMeetings.map(meeting => (
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
                </Modal>
            </div>
        );
    }
}

export default Group;