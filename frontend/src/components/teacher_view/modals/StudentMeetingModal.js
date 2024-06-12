import React from "react";
import { request, setAuthToken } from "../../../axios_helper";
import PopUpModal from "../../common/PopUpModal";

class StudentMeetingModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            studentMeetings: [],
            studentName: this.props.studentName,
        };
    }

    componentDidMount() {
        request("GET", `/teacher/get-meeting-by-student-id/${this.props.studentId}`, null)
            .then((response) => {
                this.setState({
                    studentMeetings: response.data,
                });
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setAuthToken(null);
                } else {
                    console.error("Error fetching meetings", error);
                }
            });
    }

    render() {
        const { studentMeetings, studentName } = this.state;

        return (
            <PopUpModal title={"Meetings of " + studentName} onClose={this.props.onClose}>
                {studentMeetings.length > 0 ? (
                    <table className="meeting-table rounded-more">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>State</th>
                                <th>Report</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentMeetings.map((meeting) => (
                                <tr key={meeting.id}>
                                    <td>{meeting.id}</td>
                                    <td>{meeting.startTime}</td>
                                    <td>{meeting.endTime}</td>
                                    <td>{meeting.state}</td>
                                    <td>{meeting.report}</td>
                                    <td>{meeting.meetingDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <span>No meetings</span>
                )}
            </PopUpModal>
        );
    }
}

export default StudentMeetingModal;
