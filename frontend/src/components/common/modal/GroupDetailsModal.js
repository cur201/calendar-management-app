import React from "react";
import { request, setAuthToken } from "../../../axios_helper";
import PopUpModal from "../../common/PopUpModal";

class GroupDetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupData: this.props.groupData,
            selectedGroupUsers: [],
            selectedGroupMeetings: [],
            selectedGroupId: null,
        };
        this.fetchGroupMeetings = this.props.fetch
    }

    async componentDidMount() {
        const groupId = this.props.groupId;
        const groupUsersResponse = await request("GET", `/common/get-group-user-in-group/${groupId}`);
        const groupUsers = groupUsersResponse.data;

        const groupUsersWithNames = await Promise.all(
            groupUsers.map(async (groupUser) => {
                const userResponse = await request("GET", `/common/get-user/${groupUser.userId}`);
                return {
                    ...groupUser,
                    userName: userResponse.data.name,
                    role:
                        groupUser.userId === this.state.groupData.find((group) => group.id === groupId).leaderId
                            ? "Leader"
                            : "Member",
                };
            })
        );

        // Placeholder for the group meetings response
        const groupMeetingsResponse = await this.fetchGroupMeetings(groupId);
        const groupMeetings = groupMeetingsResponse.data;

        this.setState({
            selectedGroupUsers: groupUsersWithNames,
            selectedGroupMeetings: groupMeetings,
            selectedGroupId: groupId,
        });
    }

    render() {
        const { studentMeetings, studentName } = this.state;

        return (
            <PopUpModal title="Group details" onClose={this.props.onClose}>
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
                        {this.state.selectedGroupUsers.map((user) => (
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
