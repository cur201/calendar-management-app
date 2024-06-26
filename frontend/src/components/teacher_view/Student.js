import React from "react";
import "./Student.css";
import { request, setAuthToken } from "../../axios_helper";
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
            .then(async (response) => {
                const studentsData = response.data;
                console.log('Students Data:', studentsData);
                const processedData = await this.processStudentData(studentsData);
                this.setState({ students: processedData });
                console.log('Processed Data:', processedData);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setAuthToken(null);
                } else {
                    this.setState({ data: error.response.code });
                }
            });
    }

    async processStudentData(studentsData) {
        const studentMap = new Map();

        const fetchDetailsPromises = studentsData.map(async (student) => {
            if (!studentMap.has(student.userId)) {
                studentMap.set(student.userId, {
                    id: student.userId,
                    name: "", // Placeholder for student name
                    email: "", // Placeholder for student email
                    code: student.studentCode,
                    classId: student.classId,
                    courseId: student.courseId,
                    courseName: student.courseName,
                    projectName: student.projectName,
                });

                try {
                    const details = await this.fetchStudentDetails(student.userId);
                    const updatedStudent = studentMap.get(student.userId);
                    updatedStudent.name = details.name;
                    updatedStudent.email = details.email;

                    // Update the state after fetching the details
                    this.setState(prevState => ({
                        students: prevState.students.map(s => 
                            s.id === student.userId ? updatedStudent : s
                        )
                    }));
                } catch (error) {
                    console.error(`Error fetching details for student ID ${student.userId}:`, error);
                }
            }
        });

        await Promise.all(fetchDetailsPromises);

        const processedStudents = Array.from(studentMap.values());
        console.log('Processed Students:', processedStudents);

        return processedStudents;
    }

    async fetchStudentDetails(id) {
        try {
            const response = await request("GET", `/common/get-user/${id}`, null);
            return { name: response.data.name, email: response.data.username };
        } catch (error) {
            console.error("Error fetching student details:", error);
            return { name: "", email: "" };
        }
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
        const { isAddStudentModalOpen, isStudentMeetingModalOpen, selectedStudentId, selectedStudentName, students } = this.state;
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
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Student Email</th>
                            <th>Student Code</th>
                            <th>Class ID</th>
                            <th>Course ID</th>
                            <th>Course Name</th>
                            <th>Project Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(students) && students.length > 0 ? (
                            students.map((student) => (
                                <tr
                                    key={student.id}
                                    onClick={() => this.openStudentMeetingModal(student.id, student.name)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.code}</td>
                                    <td>{student.classId}</td>
                                    <td>{student.courseId}</td>
                                    <td>{student.courseName}</td>
                                    <td>{student.projectName}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No students available</td>
                            </tr>
                        )}
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
