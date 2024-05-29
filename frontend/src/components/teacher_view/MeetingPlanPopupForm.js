import React from 'react';
import Select from 'react-select';
import { request } from '../../axios_helper';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MeetingPlanPopupForm.css';

const weekdayOptions = [
    { value: 'MONDAY', label: 'Monday' },
    { value: 'TUESDAY', label: 'Tuesday' },
    { value: 'WEDNESDAY', label: 'Wednesday' },
    { value: 'THURSDAY', label: 'Thursday' },
    { value: 'FRIDAY', label: 'Friday' },
    { value: 'SATURDAY', label: 'Saturday' },
    { value: 'SUNDAY', label: 'Sunday' },
];

class MeetingPlanPopupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            duration: '',
            location: '',
            description: '',
            visible: 1,
            weekdays: [],
            startTimes: [],
            endTimes: [],
            repetitionCount: []
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleArrayChange = (e) => {
        this.setState({ [e.target.name]: e.target.value.split(',') });
    }

    handleRepetitionCountChange = (e) => {
        const valueArray = e.target.value.split(',').map(value => Number(value.trim()));
        this.setState({ repetitionCount: valueArray });
    }

    handleWeekdayChange = (selectedOptions) => {
        const weekdays = selectedOptions ? selectedOptions.map(option => option.value) : [];
        this.setState({ weekdays });
    }

    handleSubmit = () => {
        const { name, duration, location, description, visible, weekdays, startTimes, endTimes, repetitionCount } = this.state;
        const requestBody = {
            name, duration, location, description, visible, weekdays, startTimes, endTimes, repetitionCount
        };
        request("POST", `/teacher/add-meeting-plan`, requestBody, null)
            .then(response => {
                toast.success("Meeting plan added successfully!", {
                    position: "bottom-right"
                });
                this.props.onSuccess();
                this.props.onClose();
            })
            .catch(error => {
                console.error("There was an error creating the meeting plan!", error);
                toast.error("Error adding meeting plan!", {
                    position: "bottom-right"
                });
            });
    }

    render() {
        const { onClose } = this.props;
        return (
            <div className="popup-form">
                <div className="popup-inner rounded soft-shadow">
                    <h2>Create plan</h2>
                    <div className='spacing'></div>
                    <input type="text" name="name" placeholder="Name" onChange={this.handleChange} />
                    <input type="text" name="duration" placeholder="Duration" onChange={this.handleChange} />
                    <input type="text" name="location" placeholder="Location" onChange={this.handleChange} />
                    <textarea name="description" placeholder="Description" onChange={this.handleChange} />
                    <div className='spacing'></div>
                    <Select
                        isMulti
                        name="weekdays"
                        options={weekdayOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleWeekdayChange}
                    />
                    <input type="text" name="startTimes" placeholder="Start Times (comma separated)" onChange={this.handleArrayChange} />
                    <input type="text" name="endTimes" placeholder="End Times (comma separated)" onChange={this.handleArrayChange} />
                    <input type="text" name="repetitionCount" placeholder="Repetition Count (comma separated)" onChange={this.handleRepetitionCountChange} />
                    <div className='spacing'></div>
                    <div className="button-container">
                        <button className="add-button primary-button" onClick={this.handleSubmit}>Add</button>
                        <button className="cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default MeetingPlanPopupForm;
