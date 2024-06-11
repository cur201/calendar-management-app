import "react-tabs/style/react-tabs.css";
import { request } from "../../axios_helper";
import PopUpModal from "../common/PopUpModal";
import Select from "../common/input/Select";

class AddMeetingModal extends PopUpModal {
    constructor(props) {
        super(props);
        this.state = {
            meetingPlans: [],
            selectedMeetingPlan: null,
            groups: [],
            selectedGroup: null,
            startTime: "",
            endTime: "",
        };
        this.getUserById = this.getUserById.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMeetingPlanChange = this.handleMeetingPlanChange.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
        this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    }

    componentDidMount() {
        // Fetch meeting plans
        request("GET", `/teacher/get-plans`, null)
            .then((response) => {
                this.setState({ meetingPlans: response.data });
            })
            .catch((error) => {
                console.error("Error fetching meeting plans:", error);
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedMeetingPlan !== this.state.selectedMeetingPlan) {
            if (this.state.selectedMeetingPlan) {
                // Fetch groups by meeting plan id
                request("GET", `/teacher/get-group-by-meeting-plan-id/${this.state.selectedMeetingPlan}`, null)
                    .then((response) => {
                        const groupsWithLeaderName = response.data.map(async (group) => {
                            const leaderName = await this.getUserById(group.leaderId);
                            return { ...group, leaderName };
                        });
                        Promise.all(groupsWithLeaderName)
                            .then((groups) => {
                                this.setState({ groups });
                            })
                            .catch((error) => {
                                console.error("Error fetching leader names:", error);
                            });
                    })
                    .catch((error) => {
                        console.error("Error fetching groups:", error);
                    });
            }
        }
    }

    getUserById(leaderId) {
        return request("GET", `/common/get-user/${leaderId}`, null)
            .then((response) => {
                return response.data.name;
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
                return "";
            });
    }

    handleSubmit() {
        const { selectedGroup, startTime, endTime } = this.state;

        if (selectedGroup && startTime && endTime) {
            const meetingDate = startTime.split("T")[0];

            const requestBody = {
                groupId: selectedGroup.id,
                startTime: startTime,
                endTime: endTime,
                meetingDate: meetingDate,
                state: "Wait for approve",
                report: "none",
                visible: 1,
            };

            // Send POST request to add meeting
            request("POST", "/teacher/add-meeting", requestBody)
                .then((response) => {
                    // Refresh page on success
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error adding meeting:", error);
                });
        }
    }

    handleMeetingPlanChange(e) {
        this.setState({ selectedMeetingPlan: e.value });
    }

    async handleGroupChange(e) {
        const leaderId = e.value;
        const leaderName = await this.getUserById(leaderId);
        this.setState({ selectedGroup: { id: leaderId, name: leaderName } });
    }

    handleStartTimeChange(e) {
        this.setState({ startTime: e.target.value });
    }

    handleEndTimeChange(e) {
        this.setState({ endTime: e.target.value });
    }

    render() {
        const { meetingPlans, selectedMeetingPlan, groups, selectedGroup, startTime, endTime } = this.state;

        return (
            <PopUpModal title="Add Meeting" onClose={this.props.onClose}>
                <div className="input-group">
                    <label>Select Meeting Plan</label>
                    <Select onChange={this.handleMeetingPlanChange}>
                        {meetingPlans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                                {plan.name}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className="input-group">
                    <label>Select Group:</label>
                    <Select onChange={this.handleGroupChange} disabled={!selectedMeetingPlan}>
                        {groups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.id} - {group.leaderName}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className="input-group">
                    <label>Start Time:</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={this.handleStartTimeChange}
                        disabled={!selectedGroup}
                    />
                </div>
                <div className="input-group">
                    <label>End Time:</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={this.handleEndTimeChange}
                        disabled={!selectedGroup}
                    />
                </div>
                <button onClick={this.handleSubmit}>Submit</button>
            </PopUpModal>
        );
    }
}

export default AddMeetingModal;
