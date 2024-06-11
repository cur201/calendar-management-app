import React from "react";
import "react-tabs/style/react-tabs.css";
import { request } from "../../axios_helper";
import Select from "../common/input/Select"
import Papa from "papaparse";
import PopUpModal from "../common/PopUpModal";

class AddStudentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meetingPlans: [],
            selectedMeetingPlan: null,
            studentEmail: "",
            studentName: "",
            classId: "",
            courseId: "",
            courseName: "",
            studentId: "",
            projectName: "",
            csvData: [],
            csvErrors: [],
            addMode: "manual",
        };
    }

    componentDidMount() {
        this.fetchMeetingPlans();
    }

    fetchMeetingPlans = async () => {
        const response = await request("GET", `/teacher/get-plans`, null);
        this.setState({ meetingPlans: response.data });
    };

    handleMeetingPlanChange = (obj) => {
        this.setState({ selectedMeetingPlan: obj.value });
    };

    handleAddStudent = async () => {
        const {
            studentEmail,
            studentName,
            classId,
            courseId,
            courseName,
            studentId,
            projectName,
            selectedMeetingPlan,
        } = this.state;
        const requestBody = [{ studentEmail, studentName, classId, courseId, courseName, studentId, projectName }];
        await request("POST", `/teacher/add-user-to-meeting-plan?meetingPlanId=${selectedMeetingPlan}`, requestBody);
        this.props.closeModal();
    };

    isValidStudent = (student) => {
        return student.Email && student.studentname && student.classid && student.courseid && student.StudentID;
    };

    cleanData = (data) => {
        return data
            .map((row) => ({
                Email: row.Email ? row.Email.trim() : "",
                studentname: row.studentname ? row.studentname.trim() : "",
                classid: row.classid ? row.classid.trim() : "",
                courseid: row.courseid ? row.courseid.trim() : "",
                StudentID: row.StudentID ? row.StudentID.trim() : "",
                name: row.name ? row.name.trim() : "",
                projectName: row["Tên đề tài"] ? row["Tên đề tài"].trim() : "",
            }))
            .filter((row) => {
                return (
                    row.Email ||
                    row.studentname ||
                    row.classid ||
                    row.courseid ||
                    row.StudentID ||
                    row.name ||
                    row["Tên đề tài"]
                );
            });
    };

    handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const cleanedData = this.cleanData(results.data);
                const validData = cleanedData.filter((row) => this.isValidStudent(row));
                const errors = cleanedData.filter((row) => !this.isValidStudent(row));
                this.setState({ csvErrors: errors });

                if (errors.length > 0) {
                    console.error("CSV file contains invalid data", errors);
                    alert("CSV file contains invalid data. Please check the console for more details.");
                } else {
                    this.setState({ csvData: validData });
                }
            },
            error: (error) => {
                console.error("Error reading CSV file", error);
                alert("Error reading CSV file. Please check the console for more details.");
            },
        });
    };

    handleImportCsv = async () => {
        const { csvData, selectedMeetingPlan } = this.state;
        if (csvData.length === 0) return;

        const requestBody = csvData.map((row) => ({
            studentEmail: row.Email,
            studentName: row.studentname,
            classId: row.classid,
            courseId: row.courseid,
            courseName: row.name,
            studentId: row.StudentID,
            projectName: row.projectName,
        }));

        await request("POST", `/teacher/add-user-to-meeting-plan?meetingPlanId=${selectedMeetingPlan}`, requestBody);
        this.props.closeModal();
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.csvErrors.length > 0 && prevState.csvErrors !== this.state.csvErrors) {
            console.log("Invalid CSV Data:", this.state.csvErrors);
            alert(
                `CSV file contains ${this.state.csvErrors.length} invalid rows. Please check the console for more details.`
            );
        }
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    render() {
        const {
            meetingPlans,
            studentEmail,
            studentName,
            classId,
            courseId,
            courseName,
            studentId,
            projectName,
            addMode,
        } = this.state;
        const { closeModal } = this.props;

        return (
            <PopUpModal title="Add students" onClose={this.props.onClose}>
                <div className="input-group">
                    <label>Meeting Plan</label>
                    <Select onChange={this.handleMeetingPlanChange}>
                        {meetingPlans.map((plan) => (
                            <option value={plan.id}>{plan.name}</option>
                        ))}
                    </Select>
                </div>
                <div>
                    <button
                        onClick={() => {
                            this.setState({ addMode: "manual" });
                        }}
                    >
                        Manually add student
                    </button>
                    <button
                        onClick={() => {
                            this.setState({ addMode: "csv" });
                        }}
                    >
                        Import CSV file
                    </button>
                </div>
                {addMode == "manual" ? (
                    <>
                        <div className="input-group">
                            <label>Student Email</label>
                            <input
                                type="email"
                                name="studentEmail"
                                value={studentEmail}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Student Name</label>
                            <input
                                type="text"
                                name="studentName"
                                value={studentName}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Class ID</label>
                            <input type="text" name="classId" value={classId} onChange={this.handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label>Course ID</label>
                            <input type="text" name="courseId" value={courseId} onChange={this.handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label>Course Name</label>
                            <input type="text" name="courseName" value={courseName} onChange={this.handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label>Project Name</label>
                            <input
                                type="text"
                                name="projectName"
                                value={projectName}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Student ID</label>
                            <input type="text" name="studentId" value={studentId} onChange={this.handleInputChange} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="input-group">
                            <label>Select .csv file to upload</label>
                            <input type="file" accept=".csv" onChange={this.handleFileChange} />
                        </div>
                    </>
                )}
                <div className="button-container">
                    {addMode == "manual" ? (
                        <button type="button" className="primary-button" onClick={this.handleAddStudent}>
                            Add
                        </button>
                    ) : (
                        <button type="button" className="primary-button" onClick={this.handleImportCsv}>
                            Import
                        </button>
                    )}
                    <button onClick={this.props.onClose}>Cancel</button>
                </div>
            </PopUpModal>
        );
    }
}

export default AddStudentModal;
