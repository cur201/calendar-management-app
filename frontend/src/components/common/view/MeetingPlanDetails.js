import React from "react";
import { request, setAuthToken } from "../../../axios_helper";
import withNavigate from "../Utils";

class _MeetingPlanDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: null,
            location: null,
            description: null,
            timeSlots: [],
            isEditing: false,
            editedMeetingPlan: {
                id: this.props.planId,
                name: "",
                duration: "",
                location: "",
                description: "",
                ownerUserId: null,
                visible: 1
            }
        };
    }

    componentDidMount() {
        this.fetchMeetingPlanDetails();
        this.fetchTimeSlots();
    }

    fetchMeetingPlanDetails() {
        const { planId } = this.props;
        request("GET", `/common/get-meeting-plan/${planId}`, null)
            .then((response) => {
                const { duration, location, description, name, ownerUserId } = response.data;
                this.setState({
                    duration,
                    location,
                    description,
                    editedMeetingPlan: {
                        ...this.state.editedMeetingPlan,
                        duration,
                        location,
                        description,
                        name,
                        ownerUserId
                    }
                });
            }) .catch((error) => {
                if (error.response.status === 401) {
                    setAuthToken(null);
                } else {
                    this.setState({ data: error.response.code });
                }
            })
    }

    fetchTimeSlots() {
        const { planId } = this.props;
        request("GET", `/common/get-timeslot-by-meetingplan-id?meetingPlanId=${planId}`, null)
            .then((response) => {
                const timeSlots = response.data.map(slot => ({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    timeSlotDate: slot.timeSlotDate
                }));
                this.setState({ timeSlots });
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setAuthToken(null);
                } else {
                    this.setState({ data: error.response.code });
                }
            });
    }

    handleEditClick = () => {
        this.setState({ isEditing: true });
    };

    handleDeleteClick = () => {
        const { planId, history } = this.props;
        request("DELETE", `/teacher/delete-meeting-plan/${planId}`, null)
            .then(() => {
                this.props.navigate("/dashboard/meeting-plans", { replace: true });
            })
            .catch((error) => {
                console.error("There was an error deleting the meeting plan!", error);
            });
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            editedMeetingPlan: {
                ...this.state.editedMeetingPlan,
                [name]: value
            }
        });
    };

    handleSubmitClick = () => {
        const { editedMeetingPlan } = this.state;
        request("POST", `/teacher/update-meeting-plan`, editedMeetingPlan)
            .then(() => {
                window.location.reload(); // reload the page after successful submission
            })
            .catch((error) => {
                console.error("There was an error updating the meeting plan!", error);
            });
    };


    render() {
        const { duration, location, description, timeSlots, isEditing, editedMeetingPlan } = this.state;

        return (
            <div>
                <h1>Meeting Plan Details</h1>
                {isEditing ? (
                    <div>
                        <p>
                            <strong>Duration:</strong>
                            <input
                                type="text"
                                name="duration"
                                value={editedMeetingPlan.duration}
                                onChange={this.handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Location:</strong>
                            <input
                                type="text"
                                name="location"
                                value={editedMeetingPlan.location}
                                onChange={this.handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Description:</strong>
                            <input
                                type="text"
                                name="description"
                                value={editedMeetingPlan.description}
                                onChange={this.handleInputChange}
                            />
                        </p>
                        <button onClick={this.handleSubmitClick}>Submit</button>
                    </div>
                ) : (
                    <div>
                        <p><strong>Duration:</strong> {duration}</p>
                        <p><strong>Location:</strong> {location}</p>
                        <p><strong>Description:</strong> {description}</p>
                        <button onClick={this.handleEditClick}>Edit</button>
                        <button onClick={this.handleDeleteClick}>Delete</button>
                    </div>
                )}
                <h3>Time Slots</h3>
                {timeSlots.length > 0 ? (
                    <ul>
                        {timeSlots.map((slot, index) => (
                            <li key={index}>
                                <p><strong>Date:</strong> {slot.timeSlotDate}</p>
                                <p><strong>Start Time:</strong> {slot.startTime}</p>
                                <p><strong>End Time:</strong> {slot.endTime}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Loading time slots...</p>
                )}
            </div>
        );
    }

    }

const MeetingPlanDetails = withNavigate(_MeetingPlanDetails);
export default MeetingPlanDetails;
