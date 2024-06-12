import React from "react";
import "./Student.css";
import { request, setAuthToken } from "../../axios_helper";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import AddStudentModal from "./modals/AddStudentModal";
import StudentMeetingModal from "./modals/StudentMeetingModal";

class Student extends React.Component {
    state = {
        students: [],
        isAddStudentModalOpen: false,
        isStudentMeetingModalOpen: false,
        selectedStudentId: "",
        selectedStudentName: "",
    };

    componentDidMount() {
        const teacherID = localStorage.getItem("userId");
        console.log(teacherID);
        request("GET", `/teacher/get-all-student/${teacherID}`, null)
            .then((response) => {
                const studentsData = response.data;
                const processedData = this.processStudentData(studentsData);
                this.setState({ students: processedData });
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setAuthToken(null);
                } else {
                    this.setState({ data: error.response.code });
                }
            });
    }

    processStudentData(studentsData) {
        const studentMap = new Map();

        studentsData.forEach((student) => {
            if (studentMap.has(student.studentId)) {
                const existingStudent = studentMap.get(student.studentId);
                existingStudent.meetingPlans += `; ${student.meetingPlanName}`;
            } else {
                studentMap.set(student.studentId, {
                    id: student.studentId,
                    name: student.studentName,
                    meetingPlans: student.meetingPlanName,
                    courseName: student.courseName,
                });
            }
        });

        return Array.from(studentMap.values());
    }

    openAddStudentModal = () => {
        console.log("Show");
        this.setState({ isAddStudentModalOpen: true });
    };

    closeAddStudentModal = () => {
        this.setState({ isAddStudentModalOpen: false });
        this.componentDidMount(); // Refresh the page
    };

    openStudentMeetingModal = (studentId, studentName) => {
        this.setState({
            isStudentMeetingModalOpen: true,
            selectedStudentId: studentId,
            selectedStudentName: studentName,
        });
    };

    closeStudentMeetingModal = () => {
        this.setState({ isStudentMeetingModalOpen: false });
    };

    render() {
        const { isAddStudentModalOpen, isStudentMeetingModalOpen, selectedStudentId, selectedStudentName } = this.state;
        return (
            <div className="view-container">
                <div className="top-controls">
                    <h1>Student List</h1>
                    <div className="spacing" />
                    <button className="create-button circle-button" onClick={this.openAddStudentModal}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
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
                        {this.state.students.map((student) => (
                            <tr
                                key={student.id}
                                onClick={() => this.openStudentMeetingModal(student.id, student.name)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.meetingPlans}</td>
                                <td>{student.courseName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isStudentMeetingModalOpen && (
                    <StudentMeetingModal
                        studentId={selectedStudentId}
                        studentName={selectedStudentName}
                        onClose={this.closeStudentMeetingModal}
                    />
                )}
                {isAddStudentModalOpen && <AddStudentModal onClose={this.closeAddStudentModal} />}
            </div>
        );
    }
}

export default Student;
