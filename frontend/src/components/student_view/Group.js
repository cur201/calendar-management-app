import React from 'react';
import { request, setAuthToken } from '../../axios_helper';

class Group extends React.Component{

    state = {
        groupData: [],
        isAddStudentModalOpen: false,
        isMeetingModalOpen: false,
        selectedStudentMeetings: [],
        selectedStudentName: "",
    };
    componentDidMount() {
        const studentId = localStorage.getItem("userId");
        console.log(studentId);
        request(
            "GET",
            `/student/get-group-by-student-id/${studentId}`,
            null,
        ).then((response) => {
            const groupData = response.data;
            const processedData = this.processGroupData(groupData);
            this.setState({ groupData: processedData });
        }).catch((error) => {
            if (error.response.status === 401) {
                setAuthToken(null);
            } else {
                this.setState({ data: error.response.code });
            }
        });
    }
    processGroupData(groupData) {
        return groupData.map(group => ({
            id: group.id,
            meetingPlanId: group.meetingPlanId,
            leaderId: group.leaderId,
            classId: group.classId,
            courseName: group.courseName,
            projectName: group.projectName,
            }));
        }

        render() {
            return(
                <div>
                    <h1>This is group Component.</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Meeting Plan ID</th>
                                <th>Leader ID</th>
                                <th>Class ID</th>
                                <th>Course Name</th>
                                <th>Project Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.groupData.map(group => (
                                <tr key={group.id}>
                                    <td>{group.id}</td>
                                    <td>{group.meetingPlanId}</td>
                                    <td>{group.leaderId}</td>
                                    <td>{group.classId}</td>
                                    <td>{group.courseName}</td>
                                    <td>{group.projectName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
    }
}

export default Group;