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
    const [csvData, setCsvData] = useState([]);
    const [csvErrors, setCsvErrors] = useState([]);

    useEffect(() => {
        const fetchMeetingPlans = async () => {
            const teacherID = localStorage.getItem("userId");
            const response = await request("GET", `/teacher/get-plans`, null);
            setMeetingPlans(response.data);
        };
        fetchMeetingPlans();
    }, []);

    const handleMeetingPlanChange = (event) => {
        setSelectedMeetingPlan(event.target.value);
    };

    const handleAddStudent = async () => {
        const requestBody = [{ studentEmail, studentName }];
        await request("POST", `/teacher/add-user-to-meeting-plan?meetingPlanId=${selectedMeetingPlan}`, requestBody);
        closeModal();
    };

    const isValidStudent = (student) => {
        return student.studentEmail && student.studentName;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                console.log("Parsed CSV Data:", results.data);
                const validData = results.data.filter(row => isValidStudent(row));
                const errors = results.data.filter(row => !isValidStudent(row));
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
            studentEmail: row.studentEmail,
            studentName: row.studentName
        }));

        await request("POST", `/teacher/add-user-to-meeting-plan?meetingPlanId=${selectedMeetingPlan}`, requestBody);
        closeModal();
    };

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
