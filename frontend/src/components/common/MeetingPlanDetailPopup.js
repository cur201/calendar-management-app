import { request } from "../../axios_helper";
import PopUpModal from "./PopUpModal";

class MeetingPlanDetailPopup extends PopUpModal {
    state = {
        editable: false,
        editedMeetingPlan: { ...this.props.meetingPlan },
        timeSlots: [],
        isModified: false,
    };

    componentDidMount() {
        const { meetingPlan } = this.props;
        if (meetingPlan) {
            request("GET", `/teacher/get-timeslot-by-meetingplan-id?meetingPlanId=${meetingPlan.id}`, null)
                .then((response) => {
                    this.setState({ timeSlots: response.data });
                })
                .catch((error) => {
                    console.error("Error fetching time slots:", error);
                });
        }
    }

    handleEdit = () => {
        this.setState({ editable: true });
    };

    handleDelete = () => {
        const { meetingPlan, onClose } = this.props;
        request("DELETE", `/teacher/delete-meeting-plan/${meetingPlan.id}`, null)
            .then(() => {
                onClose(true);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error deleting meeting plan:", error);
            });
    };

    handleSave = () => {
        const { editedMeetingPlan } = this.state;
        request("POST", `/teacher/update-meeting-plan`, editedMeetingPlan)
            .then(() => {
                this.setState({ isModified: false });
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error updating meeting plan:", error);
            });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            editedMeetingPlan: {
                ...prevState.editedMeetingPlan,
                [name]: value,
            },
            isModified: true,
        }));
    };

    handleClose = () => {
        const { isModified } = this.state;
        const { onClose } = this.props;

        if (isModified) {
            if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    render() {
        const { meetingPlan, onClose } = this.props;
        const { editable, editedMeetingPlan, timeSlots, isModified } = this.state;

        if (!meetingPlan) return null;

        return (
            <PopUpModal title={editable ? "Edit Meeting Plan" : meetingPlan.name} onClose={onClose}>
                {editable ? (
                    <>
                        <p>
                            <b>ID:</b> {editedMeetingPlan.id}
                        </p>
                        <input
                            type="text"
                            name="name"
                            value={editedMeetingPlan.name}
                            onChange={this.handleInputChange}
                        />
                        <input
                            type="text"
                            name="duration"
                            value={editedMeetingPlan.duration}
                            onChange={this.handleInputChange}
                        />
                        <input
                            type="text"
                            name="location"
                            value={editedMeetingPlan.location}
                            onChange={this.handleInputChange}
                        />
                        <input
                            type="text"
                            name="description"
                            value={editedMeetingPlan.description}
                            onChange={this.handleInputChange}
                        />
                        <input
                            type="text"
                            name="ownerUserId"
                            value={editedMeetingPlan.ownerUserId}
                            onChange={this.handleInputChange}
                        />
                        <button onClick={this.handleSave} disabled={!isModified}>
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        <p>
                            <b>ID:</b> {meetingPlan.id}
                        </p>
                        <p>
                            <b>Duration:</b> {meetingPlan.duration}
                        </p>
                        <p>
                            <b>Location:</b> {meetingPlan.location}
                        </p>
                        <p>
                            <b>Description:</b> {meetingPlan.description}
                        </p>
                        <p>
                            <b>Owner User ID:</b> {meetingPlan.ownerUserId}
                        </p>
                    </>
                )}
                {this.props.readOnly ? (
                    ""
                ) : (
                    <div>
                        <button onClick={this.handleEdit}>Edit</button>
                        <button onClick={this.handleDelete}>Delete</button>
                    </div>
                )}

                <h3>Time Slots</h3>
                <div className="timeslot-list">
                    {timeSlots.map((slot) => (
                        <div key={slot.id} className="timeslot-item">
                            <p>
                                <b>Date:</b> {`${slot.timeSlotDate[2]}/${slot.timeSlotDate[1]}/${slot.timeSlotDate[0]}`}
                            </p>
                            <p>
                                <b>Start Time:</b> {`${slot.startTime[0]}:${slot.startTime[1]}`}
                            </p>
                            <p>
                                <b>End Time:</b> {`${slot.endTime[0]}:${slot.endTime[1]}`}
                            </p>
                        </div>
                    ))}
                </div>
            </PopUpModal>
        );
    }
}

export default MeetingPlanDetailPopup;
