import React from "react";
import { request } from "../../../axios_helper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PopUpModal from "../../common/PopUpModal";
import TimeSlotPicker from "../../common/TimeSlotPicker";
import "./CreatePlanModal.css";

const weekdayOptions = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
    { value: "SATURDAY", label: "Saturday" },
    { value: "SUNDAY", label: "Sunday" },
];

class CreatePlanModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            duration: "",
            location: "",
            description: "",
            visible: 1,
            weekdays: [],
            startTimes: [],
            endTimes: [],
            repetitionCount: [],
            timeSlots: [],
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleArrayChange = (e) => {
        this.setState({ [e.target.name]: e.target.value.split(",") });
    };

    handleRepetitionCountChange = (e) => {
        const valueArray = e.target.value.split(",").map((value) => Number(value.trim()));
        this.setState({ repetitionCount: valueArray });
    };

    handleWeekdayChange = (selectedOptions) => {
        const weekdays = selectedOptions ? selectedOptions.map((option) => option.value) : [];
        this.setState({ weekdays });
    };

    handleSubmit = () => {
        const { name, duration, location, description, visible, timeSlots } =
            this.state;
        const timeSlotsData = timeSlots.map(timeSlot => ({...timeSlot.data}))
        const requestBody = {
            name,
            duration,
            location,
            description,
            visible,
            timeslot: timeSlotsData,
        };
        request("POST", `/teacher/add-meeting-plan`, requestBody, null)
            .then((response) => {
                toast.success("Meeting plan added successfully!", {
                    position: "bottom-right",
                });
                this.props.onSuccess();
                this.props.onClose();
            })
            .catch((error) => {
                console.error("There was an error creating the meeting plan!", error);
                toast.error("Error adding meeting plan!", {
                    position: "bottom-right",
                });
            });
    };

    removeTimeSlot = (slotId) => {
        this.setState((prevState) => ({
            timeSlots: prevState.timeSlots.filter((slot) => slot.slotId !== slotId),
        }));
    };

    addTimeSlot = () => {
        const newSlot = {
            slotId: window.crypto.randomUUID(),
            data: {},
        };
        this.setState((prevState) => ({
            timeSlots: [...prevState.timeSlots, newSlot],
        }));
    };

    updateTimeSlot = (slotId, updatedData) => {
        this.setState((prevState) => ({
            timeSlots: prevState.timeSlots.map((slot) =>
                slot.slotId === slotId ? { slotId: slotId, data: updatedData } : slot
            ),
        }));
    };

    render() {
        const { timeSlots } = this.state;
        return (
            <PopUpModal title="Create plan" onClose={this.props.onClose}>
                <div className="input-group">
                    <label>Name</label>
                    <input type="text" name="name" placeholder="Name" onChange={this.handleChange} />
                </div>
                <div className="input-group">
                    <label>Duration</label>
                    <input type="text" name="duration" placeholder="Duration" onChange={this.handleChange} />
                </div>
                <div className="input-group">
                    <label>Location</label>
                    <input type="text" name="location" placeholder="Location" onChange={this.handleChange} />
                </div>
                <div className="input-group">
                    <label>Description</label>
                    <textarea name="description" placeholder="Description" onChange={this.handleChange} />
                </div>
                <div className="input-group">
                    <label>
                        Time slots
                        <button
                            className="create-button circle-button"
                            onClick={this.addTimeSlot}
                            style={{ transform: "scale(0.65, 0.65) translateY(3px)" }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </label>
                    <div className="time-slots-container">
                        {timeSlots.map((slot) => (
                            <TimeSlotPicker
                                key={slot.slotId}
                                slotId={slot.slotId}
                                timeSlot={slot.data}
                                onRemove={this.removeTimeSlot}
                                onUpdate={this.updateTimeSlot}
                            />
                        ))}
                    </div>
                </div>
                {/* <Select
                    isMulti
                    name="weekdays"
                    options={weekdayOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={this.handleWeekdayChange}
                />
                <input
                    type="text"
                    name="startTimes"
                    placeholder="Start Times (comma separated)"
                    onChange={this.handleArrayChange}
                />
                <input
                    type="text"
                    name="endTimes"
                    placeholder="End Times (comma separated)"
                    onChange={this.handleArrayChange}
                />
                <input
                    type="text"
                    name="repetitionCount"
                    placeholder="Repetition Count (comma separated)"
                    onChange={this.handleRepetitionCountChange}
                /> */}
                <div className="spacing"></div>
                <div className="button-container">
                    <button className="add-button primary-button" onClick={this.handleSubmit}>
                        Add
                    </button>
                    <button className="cancel-button" onClick={this.props.onClose}>
                        Cancel
                    </button>
                </div>
            </PopUpModal>
        );
    }
}

export default CreatePlanModal;
