import React from 'react';
import './Student.css';
import { request, setAuthToken } from '../../axios_helper';
import Modal from 'react-modal';
import AddStudentModal from './AddStudentModal';

class Student extends React.Component {
    state = {
        students: [],
        isAddStudentModalOpen: false,
        isMeetingModalOpen: false,
        selectedStudentMeetings: [],
        selectedStudentName: "",
    };

    componentDidMount() {
        const teacherID = localStorage.getItem("userId");
        console.log(teacherID);
        request(
            "GET",
            `/teacher/get-all-student/${teacherID}`,
            null,
        ).then((response) => {
            const studentsData = response.data;
            const processedData = this.processStudentData(studentsData);
            this.setState({ students: processedData });
        }).catch((error) => {
            if (error.response.status === 401) {
                setAuthToken(null);
            } else {
                this.setState({ data: error.response.code });
            }
        });
    }

    processStudentData(studentsData) {
        const studentMap = new Map();

        studentsData.forEach(student => {
            if (studentMap.has(student.studentId)) {
                const existingStudent = studentMap.get(student.studentId);
                existingStudent.meetingPlans += `; ${student.meetingPlanName}`;
            } else {
                studentMap.set(student.studentId, {
                    id: student.studentId,
                    name: student.studentName,
                    meetingPlans: student.meetingPlanName,
                    courseName: student.courseName
                });
            }
        });

        return Array.from(studentMap.values());
    }

    openAddStudentModal = () => {
        this.setState({ isAddStudentModalOpen: true });
    }

    closeAddStudentModal = () => {
        this.setState({ isAddStudentModalOpen: false });
        this.componentDidMount(); // Refresh the page
    }

    openMeetingModal = (studentId, studentName) => {
        request(
            "GET",
            `/teacher/get-meeting-by-student-id/${studentId}`,
            null,
        ).then((response) => {
            this.setState({
                selectedStudentMeetings: response.data,
                selectedStudentName: studentName,
                isMeetingModalOpen: true
            });
        }).catch((error) => {
            if (error.response.status === 401) {
                setAuthToken(null);
            } else {
                console.error("Error fetching meetings", error);
            }
        });
    }

    closeMeetingModal = () => {
        this.setState({ isMeetingModalOpen: false });
    }

    render() {
        return (
            <div>
                <h1>Student List</h1>
                <button onClick={this.openAddStudentModal}>Add Student</button>
                <table className="student-table rounded-more">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Meeting Plan</th>
                            <th>Course Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.students.map(student => (
                            <tr key={student.id} onClick={() => this.openMeetingModal(student.id, student.name)} style={{ cursor: 'pointer' }}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.meetingPlans}</td>
                                <td>{student.courseName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Modal
                    isOpen={this.state.isMeetingModalOpen}
                    onRequestClose={this.closeMeetingModal}
                    contentLabel="Student Meetings"
                >
                    <h2>Meetings of {this.state.selectedStudentName}</h2>
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
                            {this.state.selectedStudentMeetings.map(meeting => (
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
                    <button onClick={this.closeMeetingModal}>Close</button>
                </Modal>

                <Modal
                    isOpen={this.state.isAddStudentModalOpen}
                    onRequestClose={this.closeAddStudentModal}
                    contentLabel="Add Student"
                >
                    <AddStudentModal closeModal={this.closeAddStudentModal} />
                </Modal>
            </div>
        );
    }
}

export default Student;
