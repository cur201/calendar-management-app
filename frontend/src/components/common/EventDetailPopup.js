import React, { Component } from "react";
import { request } from "../../axios_helper";
import PopUpModal from "./PopUpModal";

class EventDetailPopup extends PopUpModal {
    constructor(props) {
        super(props);
        const { event } = props;

        this.state = {
            startTime: this.formatTime(event.startTime),
            endTime: this.formatTime(event.endTime),
            report: event.report,
            meetingDate: this.formatDate(event.meetingDate),
        };
    }

    formatTime(timeArray) {
        if (Array.isArray(timeArray) && timeArray.length === 2) {
            const [hours, minutes] = timeArray.map(num => String(num).padStart(2, '0'));
            return `${hours}:${minutes}`;
        }
        return "";
    }

    formatDate(dateArray) {
        if (Array.isArray(dateArray) && dateArray.length === 3) {
            const [year, month, day] = dateArray;
            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
        return "";
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSave = () => {
        const { startTime, endTime, report, meetingDate } = this.state;
        const { event } = this.props;

        const updatedEvent = {
            id: event.id,
            groupId: event.groupId,
            startTime: startTime,
            endTime: endTime,
            meetingDate: meetingDate,
            state: event.state,
            report: report,
            visible: 1
        };

        request("POST", "/teacher/update-meeting", updatedEvent)
            .then(response => {
                // Handle the response accordingly
                console.log("Event details updated successfully", response.data);
                window.location.reload();
            })
            .catch(error => {
                console.error("Error updating event details", error);
            });
    };

    render() {
        const { event, onClose } = this.props;
        const { startTime, endTime, report, meetingDate } = this.state;
        const isEditable = event.state === 'Wait for approve';
        const isReportEditable = event.state === 'Accepted' || event.state === 'Finished';

        return (
            <PopUpModal onClose={onClose}>
                <div>
                    <h1>Meeting Popup</h1>
                    <div>
                        <label>Start Time: </label>
                        <input
                            type="time"
                            name="startTime"
                            value={startTime}
                            onChange={this.handleChange}
                            disabled={!isEditable}
                        />
                    </div>
                    <div>
                        <label>End Time: </label>
                        <input
                            type="time"
                            name="endTime"
                            value={endTime}
                            onChange={this.handleChange}
                            disabled={!isEditable}
                        />
                    </div>
                    <div>
                        <label>Meeting Date: </label>
                        <input
                            type="date"
                            name="meetingDate"
                            value={meetingDate}
                            onChange={this.handleChange}
                            disabled={!isEditable}
                        />
                    </div>
                    <div>
                        <label>Course Name: </label>
                        <span>{event.group?.courseName || 'No course name'}</span>
                    </div>
                    <div>
                        <label>Leader Name: </label>
                        <span>{event.leader?.name || 'No leader'}</span>
                    </div>
                    <div>
                        <label>Status: </label>
                        <span>{event.state}</span>
                    </div>
                    <div>
                        <label>Report: </label>
                        <textarea
                            name="report"
                            value={report}
                            onChange={this.handleChange}
                            disabled={!isReportEditable}
                        />
                    </div>
                    <div>
                        <button onClick={this.handleSave} disabled={event.status === 'Canceled'}>Save</button>
                        <button onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </PopUpModal>
        );
    }
}

export default EventDetailPopup;
