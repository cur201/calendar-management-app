import React from "react";
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
            meetingState: event.state,
        };
    }

    formatTime(timeArray) {
        if (Array.isArray(timeArray) && timeArray.length === 2) {
            const [hours, minutes] = timeArray.map((num) => String(num).padStart(2, "0"));
            return `${hours}:${minutes}`;
        }
        return "";
    }

    formatDate(dateArray) {
        if (Array.isArray(dateArray) && dateArray.length === 3) {
            const [year, month, day] = dateArray;
            return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        }
        return "";
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSave = () => {
        const { startTime, endTime, report, meetingDate, meetingState } = this.state;
        const { event } = this.props;

        const updatedEvent = {
            id: event.id,
            groupId: event.groupId,
            startTime: startTime,
            endTime: endTime,
            meetingDate: meetingDate,
            state: meetingState,
            report: report,
            visible: 1,
        };

        request("POST", "/common/update-meeting", updatedEvent)
            .then((response) => {
                // Handle the response accordingly
                console.log("Event details updated successfully", response.data);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error updating event details", error);
            });
    };

    render() {
        const { event, onClose } = this.props;
        const { startTime, endTime, report, meetingDate, meetingState } = this.state;
        const isEditable = event.state === "Wait for approve";
        const isReportEditable = event.state === "Accepted" || event.state === "Finished";
        const statusOptions = ["Wait for approve", "Accepted", "Canceled"];

        return (
            <PopUpModal onClose={onClose} title="Details">
                <div className="input-group">
                    <label>Start Time</label>
                    <input
                        type="time"
                        name="startTime"
                        value={startTime}
                        onChange={this.handleChange}
                        disabled={!isEditable}
                    />
                </div>
                <div className="input-group">
                    <label>End Time</label>
                    <input
                        type="time"
                        name="endTime"
                        value={endTime}
                        onChange={this.handleChange}
                        disabled={!isEditable}
                    />
                </div>
                <div className="input-group">
                    <label>Meeting Date</label>
                    <input
                        type="date"
                        name="meetingDate"
                        value={meetingDate}
                        onChange={this.handleChange}
                        disabled={!isEditable}
                    />
                </div>
                <div className="input-group">
                    <label>Course Name</label>
                    <span className="uneditable">{event.group?.courseName || "No course name"}</span>
                </div>
                <div className="input-group">
                    <label>Leader Name</label>
                    <span className="uneditable">{event.leader?.name || "No leader"}</span>
                </div>
                <div className="input-group">
                    <label>Status</label>
                    {event.state === "Wait for approve" || event.state === "Accepted" ? (
                        <select name="meetingState" value={meetingState} onChange={this.handleChange}>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            name="meetingState"
                            value={event.state}
                            onChange={this.handleChange}
                            disabled
                        />
                    )}
                </div>
                <div className="input-group">
                    <label>Report</label>
                    <textarea name="report" value={report} onChange={this.handleChange} disabled={!isReportEditable} />
                </div>
                <div className="button-container">
                    <button onClick={this.handleSave} disabled={event.status === "Canceled"}>
                        Save
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </PopUpModal>
        );
    }
}

export default EventDetailPopup;
