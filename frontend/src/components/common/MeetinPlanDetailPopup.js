import React, { useEffect, useState } from 'react';
import { request } from '../../axios_helper';
import "./MeetingPlanDetailPopup.css";

const MeetingPlanDetailPopup = ({ meetingPlan, onClose }) => {
    const [timeSlots, setTimeSlots] = useState([]);

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

    if (!meetingPlan) return null;

    return (
        <div className="meeting-plan-detail-popup">
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>Close</button>
                <h2>{meetingPlan.name}</h2>
                <p><b>Duration:</b> {meetingPlan.duration}</p>
                <p><b>Location:</b> {meetingPlan.location}</p>
                <p><b>Description:</b> {meetingPlan.description}</p>
                <p><b>Owner User ID:</b> {meetingPlan.ownerUserId}</p>
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
