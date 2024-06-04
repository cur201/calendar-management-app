import React, { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import { request } from '../../axios_helper';

const AddMeetingModal = ({ closeModal }) => {
    const [meetingPlans, setMeetingPlans] = useState([]);
    const [selectedMeetingPlan, setSelectedMeetingPlan] = useState(null);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        // Fetch meeting plans
        request("GET", `http://localhost:8081/teacher/get-plans`, null)
            .then(response => {
                setMeetingPlans(response.data);
            })
            .catch(error => {
                console.error('Error fetching meeting plans:', error);
            });
    }, []);

    useEffect(() => {
        if (selectedMeetingPlan) {
            // Fetch groups by meeting plan id
            request("GET", `http://localhost:8081/teacher/get-group-by-meeting-plan-id/${selectedMeetingPlan.id}`, null)
                .then(response => { 
                    setGroups(response.data);
                })
                .catch(error => {
                    console.error('Error fetching groups:', error);
                });
        }
    }, [selectedMeetingPlan]);

    const handleSubmit = () => {
        if (selectedGroup && startTime && endTime) {
            const requestBody = {
                groupId: selectedGroup.id,
                startTime: startTime,
                endTime: endTime,
                state: 'Wait for approve',
                report: 'none',
                visible: 1
            };

            // Send POST request to add meeting
            request("POST", '/teacher/add-meeting', requestBody)
                .then(response => {
                    // Refresh page on success
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error adding meeting:', error);
                });
        }
    };

    return (
        <div>
            <h1>Add Meeting</h1>
            <div>
                <label>Select Meeting Plan:</label>
                <select onChange={e => setSelectedMeetingPlan(JSON.parse(e.target.value))}>
                    <option value="">Select Meeting Plan</option>
                    {meetingPlans.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                </select>
            </div>
            {selectedMeetingPlan && (
                <div>
                    <label>Select Group:</label>
                    <select onChange={e => setSelectedGroup(JSON.parse(e.target.value))}>
                        <option value="">Select Group</option>
                        {groups.map(group => (
                            <option key={group.id} value={JSON.stringify(group)}>{group.name}</option>
                        ))}
                    </select>
                </div>
            )}
            {selectedGroup && (
                <div>
                    <label>Start Time:</label>
                    <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
                    <label>End Time:</label>
                    <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
            )}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default AddMeetingModal;
