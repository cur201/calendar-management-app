import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./TimeSlotPicker.css";

class TimeSlotPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weekday: this.props.timeSlot.weekday,
            startTime: this.props.timeSlot.startTime,
            endTime: this.props.timeSlot.endTime,
            repetitionCount: this.props.timeSlot.repeat || 1,
        };
        this.slotId = this.props.slotId;
        this.updateValue = (values) => {this.props.onUpdate(this.slotId, values)};
    }

    handleWeekdayChange = (event) => {
        this.setState({ weekday: event.target.value }, () => this.updateValue(this.state));
    };

    handleStartTimeChange = (event) => {
        this.setState({ startTime: event.target.value }, () =>this.updateValue(this.state));
    };

    handleEndTimeChange = (event) => {
        this.setState({ endTime: event.target.value }, () =>this.updateValue(this.state));
    };

    handleRepeatTimesChange = (event) => {
        const repetitionCount = parseInt(event.target.value);
        this.setState({ repetitionCount: repetitionCount }, () => this.updateValue(this.state));
    };

    render() {
        return (
            <div className="timeslot-picker shadow rounded">
                <button className="remove-button" onClick={() => this.props.onRemove(this.slotId)}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
                <div className="timeslot-weekdays">
                    <label>Weekday</label>
                    <div>
                        <input
                            type="radio"
                            name={`weekdays-${this.slotId}`}
                            id={`sun-check-${this.slotId}`}
                            value="SUNDAY"
                            onChange={this.handleWeekdayChange}
                        />
                        <label htmlFor={`sun-check-${this.slotId}`}>S</label>
                        <input
                            type="radio"
                            name={`weekdays-${this.slotId}`}
                            id={`mon-check-${this.slotId}`}
                            value="MONDAY"
                            onChange={this.handleWeekdayChange}
                        />
                        <label htmlFor={`mon-check-${this.slotId}`}>M</label>
                        <input
                            type="radio"
                            name={`weekdays-${this.slotId}`}
                            id={`tue-check-${this.slotId}`}
                            value="TUESDAY"
                            onChange={this.handleWeekdayChange}
                        />
                        <label htmlFor={`tue-check-${this.slotId}`}>T</label>
                        <input
                            type="radio"
                            name={`weekdays-${this.slotId}`}
                            id={`wed-check-${this.slotId}`}
                            value="WEDNESDAY"
                            onChange={this.handleWeekdayChange}
                        />
                        <label htmlFor={`wed-check-${this.slotId}`}>W</label>
                        <input
                            type="radio"
                            name={`weekdays-${this.slotId}`}
                            id={`thu-check-${this.slotId}`}
                            value="THURSDAY"
                            onChange={this.handleWeekdayChange}
                        />
                        <label htmlFor={`thu-check-${this.slotId}`}>T</label>
                        <input
                            type="radio"
                            name={`weekdays-${this.slotId}`}
                            id={`fri-check-${this.slotId}`}
                            value="FRIDAY"
                            onChange={this.handleWeekdayChange}
                        />
                        <label htmlFor={`fri-check-${this.slotId}`}>F</label>
                        <input
                            type="radio"
                            name={`weekdays-${this.slotId}`}
                            id={`sat-check-${this.slotId}`}
                            value="SATURDAY"
                            onChange={this.handleWeekdayChange}
                        />
                        <label htmlFor={`sat-check-${this.slotId}`}>S</label>
                    </div>
                </div>
                <div className="line-break"></div>
                <div className="flex-row">
                    <label>From</label>
                    <input type="time" onChange={this.handleStartTimeChange} />
                    <label>to</label>
                    <input type="time" onChange={this.handleEndTimeChange} />
                    <div className="spacing"></div>
                    <label>Repeat</label>
                    <input
                        type="number"
                        max={10}
                        min={1}
                        defaultValue={1}
                        onChange={this.handleRepeatTimesChange}
                    ></input>
                </div>
            </div>
        );
    }
}

export default TimeSlotPicker;
