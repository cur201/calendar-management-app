import React from 'react';
import './Student.css';
import { request, setAuthToken } from '../../axios_helper';

class Student extends React.Component {
    state = {
        students: []
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
                    meetingPlans: student.meetingPlanName
                });
            }
        });

        return Array.from(studentMap.values());
    }

    render() {
        return (
            <div>
                <h1>Student List</h1>
                <table className="student-table rounded-more">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Meeting Plan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.students.map(student => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.meetingPlans}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Student;
