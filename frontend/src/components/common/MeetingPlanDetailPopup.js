import React, { useEffect, useState } from 'react';
import { request } from '../../axios_helper';
import "./MeetingPlanDetailPopup.css";

const MeetingPlanDetailPopup = ({ meetingPlan, onClose }) => {
    const [editable, setEditable] = useState(false);
    const [editedMeetingPlan, setEditedMeetingPlan] = useState({ ...meetingPlan });
    const [timeSlots, setTimeSlots] = useState([]);
    const [isModified, setIsModified] = useState(false);

    useEffect(() => {
        if (meetingPlan) {
            request(
                "GET",
                `/teacher/get-timeslot-by-meetingplan-id?meetingPlanId=${meetingPlan.id}`,
                null,
            ).then((response) => {
                setTimeSlots(response.data);
            }).catch((error) => {
                console.error("Error fetching time slots:", error);
            });
        }
    }, [meetingPlan]);

    const handleEdit = () => {
        setEditable(true);
    };

    const handleDelete = () => {
        request(
            "DELETE",
            `/teacher/delete-meeting-plan/${meetingPlan.id}`,
            null,
        ).then(() => {
            onClose(true); 
            window.location.reload();
        }).catch((error) => {
            console.error("Error deleting meeting plan:", error);
        });
    };

    const handleSave = () => {
        request(
            "POST",
            `/teacher/update-meeting-plan`,
            editedMeetingPlan,
        ).then(() => {
            setIsModified(false);
            window.location.reload();
        }).catch((error) => {
            console.error("Error updating meeting plan:", error);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedMeetingPlan(prevState => ({
            ...prevState,
            [name]: value
        }));
        setIsModified(true);
    };

    const handleClose = () => {
        if (isModified) {
            // Handle unsaved changes
            if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    if (!meetingPlan) return null;

    return (
        <div className="meeting-plan-detail-popup">
            <div className="popup-content">
                <button className="close-button" onClick={handleClose}>X</button>
                {editable ? (
                    <>
                        <h2>Edit Meeting Plan</h2>
                        <p><b>ID:</b> {editedMeetingPlan.id}</p>
                        <input type="text" name="name" value={editedMeetingPlan.name} onChange={handleInputChange} />
                        <input type="text" name="duration" value={editedMeetingPlan.duration} onChange={handleInputChange} />
                        <input type="text" name="location" value={editedMeetingPlan.location} onChange={handleInputChange} />
                        <input type="text" name="description" value={editedMeetingPlan.description} onChange={handleInputChange} />
                        <input type="text" name="ownerUserId" value={editedMeetingPlan.ownerUserId} onChange={handleInputChange} />
                        <button onClick={handleSave} disabled={!isModified}>Save</button>
                    </>
                ) : (
                    <>
                        <h2>{meetingPlan.name}</h2>
                        <p><b>ID:</b> {meetingPlan.id}</p>
                        <p><b>Duration:</b> {meetingPlan.duration}</p>
                        <p><b>Location:</b> {meetingPlan.location}</p>
                        <p><b>Description:</b> {meetingPlan.description}</p>
                        <p><b>Owner User ID:</b> {meetingPlan.ownerUserId}</p>
                    </>
                )}
                <div>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>

                <h3>Time Slots</h3>
                <div className="timeslot-list">
                    {timeSlots.map((slot) => (
                        <div key={slot.id} className="timeslot-item">
                            <p><b>Date:</b> {`${slot.timeSlotDate[2]}/${slot.timeSlotDate[1]}/${slot.timeSlotDate[0]}`}</p>
                            <p><b>Start Time:</b> {`${slot.startTime[0]}:${slot.startTime[1]}`}</p>
                            <p><b>End Time:</b> {`${slot.endTime[0]}:${slot.endTime[1]}`}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MeetingPlanDetailPopup;
