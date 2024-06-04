import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { request } from '../../axios_helper';
import Papa from 'papaparse';

const AddStudentModal = ({ closeModal }) => {
    const [meetingPlans, setMeetingPlans] = useState([]);
    const [selectedMeetingPlan, setSelectedMeetingPlan] = useState(null);
    const [studentEmail, setStudentEmail] = useState('');
    const [studentName, setStudentName] = useState('');
    const [classId, setClassId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [courseName, setCourseName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [projectName, setProjectName] = useState('');
    const [csvData, setCsvData] = useState([]);
    const [csvErrors, setCsvErrors] = useState([]);

    useEffect(() => {
        const fetchMeetingPlans = async () => {
            // const teacherID = localStorage.getItem("userId");
            const response = await request("GET", `/teacher/get-plans`, null);
            setMeetingPlans(response.data);
        };
        fetchMeetingPlans();
    }, []);

    const handleMeetingPlanChange = (event) => {
        setSelectedMeetingPlan(event.target.value);
    };

    const handleAddStudent = async () => {
        const requestBody = [{ studentEmail, studentName, classId, courseId, courseName, studentId, projectName }];
        await request("POST", `/teacher/add-user-to-meeting-plan?meetingPlanId=${selectedMeetingPlan}`, requestBody);
        closeModal();
    };

    const isValidStudent = (student) => {
        return student.Email && student.studentname && student.classid && student.courseid && student.StudentID;
    };

    const cleanData = (data) => {
        return data.map(row => ({
            Email: row.Email ? row.Email.trim() : "",
            studentname: row.studentname ? row.studentname.trim() : "",
            classid: row.classid ? row.classid.trim() : "",
            courseid: row.courseid ? row.courseid.trim() : "",
            StudentID: row.StudentID ? row.StudentID.trim() : ""
        })).filter(row => {
            return row.Email || row.studentname || row.classid || row.courseid || row.StudentID;
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                console.log("Parsed CSV Data:", results.data);
                const cleanedData = cleanData(results.data);
                const validData = cleanedData.filter(row => isValidStudent(row));
                const errors = cleanedData.filter(row => !isValidStudent(row));
                setCsvErrors(errors);
    
                if (errors.length > 0) {
                    console.error("CSV file contains invalid data", errors);
                    alert("CSV file contains invalid data. Please check the console for more details.");
                } else {
                    setCsvData(validData);
                }
            },
            error: (error) => {
                console.error("Error reading CSV file", error);
                alert("Error reading CSV file. Please check the console for more details.");
            }
        });
    };

    const handleImportCsv = async () => {
        if (csvData.length === 0) return;

        const requestBody = csvData.map(row => ({
            studentEmail: row.Email,
            studentName: row.studentname,
            classId: row.classid,
            courseId: row.courseid,
            courseName: row.name,
            studentId: row.StudentID,
            projectName: row["Tên đề tài"] || "No Project Name"
        }));

        await request("POST", `/teacher/add-user-to-meeting-plan?meetingPlanId=${selectedMeetingPlan}`, requestBody);
        closeModal();
    };

    useEffect(() => {
        if (csvErrors.length > 0) {
            console.log("Invalid CSV Data:", csvErrors);
            alert(`CSV file contains ${csvErrors.length} invalid rows. Please check the console for more details.`);
        }
    }, [csvErrors]);

    return (
        <div>
            <Tabs>
                <TabList>
                    <Tab>Choose Meeting Plan</Tab>
                    <Tab>Choose Add Option</Tab>
                </TabList>

                <TabPanel>
                    <h2>Choose Meeting Plan</h2>
                    <ul>
                        {meetingPlans.map(plan => (
                            <li key={plan.id}>
                                <input
                                    type="radio"
                                    name="meetingPlan"
                                    value={plan.id}
                                    onChange={handleMeetingPlanChange}
                                />
                                {plan.name}
                            </li>
                        ))}
                    </ul>
                </TabPanel>
                <TabPanel>
                    <h2>Choose Add Option</h2>
                    <form>
                        <label>
                            Student Email:
                            <input
                                type="email"
                                value={studentEmail}
                                onChange={(e) => setStudentEmail(e.target.value)}
                            />
                        </label>
                        <label>
                            Student Name:
                            <input
                                type="text"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                            />
                        </label>
                        <label>
                            Class ID:
                            <input
                                type="text"
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)}
                            />
                        </label>
                        <label>
                            Course ID:
                            <input
                                type="text"
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                            />
                        </label>
                        <label>
                            Course Name:
                            <input
                                type="text"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                            />
                        </label>
                        <label>
                            Project Name:
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                        </label>
                        <label>
                            Student ID:
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            />
                        </label>
                        <button type="button" onClick={handleAddStudent}>Add</button>
                    </form>
                    <hr />
                    <h3>Import .csv file</h3>
                    <input type="file" accept=".csv" onChange={handleFileChange} />
                    <button type="button" onClick={handleImportCsv}>Import</button>
                </TabPanel>
            </Tabs>
            <button onClick={closeModal}>Close</button>
        </div>
    );
};

export default AddStudentModal;
