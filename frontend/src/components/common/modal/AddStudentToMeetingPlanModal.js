import React from "react";
import { request } from "../../../axios_helper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PopUpModal from "../../common/PopUpModal";

class AddStudentToMeetingPlanModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            selectedStudents: [],
        };
    }

    componentDidMount() {
        const teacherID = localStorage.getItem("userId");
        if (teacherID) {
            request("GET", `/teacher/get-all-student/${teacherID}`)
                .then(async (response) => {
                    const students = response.data;
                    const studentsWithUserInfo = await Promise.all(
                        students.map(async (student) => {
                            const userResponse = await request("GET", `/common/get-user/${student.userId}`);
                            const userInfo = userResponse.data;
                            return {
                                ...student,
                                name: userInfo.name,
                                email: userInfo.username,
                            };
                        })
                    );
                    this.setState({ students: studentsWithUserInfo });
                })
                .catch((error) => {
                    toast.error("Error fetching students");
                    console.error("Error fetching students:", error);
                });
        } else {
            toast.error("Teacher ID not found");
        }
    }

    handleCheckboxChange = (student) => {
        this.setState((prevState) => {
            const selectedStudents = [...prevState.selectedStudents];
            const index = selectedStudents.findIndex((s) => s.id === student.id);
            if (index > -1) {
                selectedStudents.splice(index, 1);
            } else {
                selectedStudents.push(student);
            }
            return { selectedStudents };
        });
    };

    handleAddStudents = async () => {
        const { selectedStudents } = this.state;
        const { planId } = this.props;

        const requestBody = selectedStudents.map((student) => ({
            id: student.id,
            userId: student.userId,
            classId: student.classId,
        }));

        try {
            await request("POST", `/teacher/add-student-to-meeting-plan?meetingPlanId=${planId}`, requestBody);
            toast.success("Students added successfully");
            this.props.onClose();
            window.location.reload(); // Refresh the page
        } catch (error) {
            toast.error("Error adding students to meeting plan");
            console.error("Error adding students:", error);
        }
    };

    render() {
        const { students, selectedStudents } = this.state;

        return (
            <PopUpModal title="Add Student" onClose={this.props.onClose}>
                <table>
                    <thead>
                        <tr>
                            <th>Select</th>
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
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.some((s) => s.id === student.id)}
                                        onChange={() => this.handleCheckboxChange(student)}
                                    />
                                </td>
                                <td>{student.userId}</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.studentCode}</td>
                                <td>{student.classId}</td>
                                <td>{student.courseId}</td>
                                <td>{student.courseName}</td>
                                <td>{student.projectName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={this.handleAddStudents}>Add Selected Students</button>
            </PopUpModal>
        );
    }
}

export default AddStudentToMeetingPlanModal;