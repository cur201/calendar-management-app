import * as React from 'react';
import { request, setAuthToken } from '../../axios_helper';
import "./Event.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';

const viewIcon = <FontAwesomeIcon icon={faEye} />;
const editIcon = <FontAwesomeIcon icon={faPencil} />;
const deleteIcon = <FontAwesomeIcon icon={faTrash} />;

export default class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentPage: 0,
            currentTab: 'Wait for approve',
            groupInfo: {},
            userInfo: {},
            meetingPlanInfo: {},
            isModalOpen: false,
            modalContent: '',
        };
    }

    fetchAdditionalData() {
        const { data } = this.state;
        data.forEach(meeting => {
            request("GET", `/common/get-group/${meeting.groupId}`)
                .then(response => {
                    this.setState(prevState => ({
                        groupInfo: {
                            ...prevState.groupInfo,
                            [meeting.groupId]: response.data
                        }
                    }));

                    const leaderId = response.data.leaderId;
                    // console.log("Leader ID: " + leaderId);
                    const meetingPlanId = response.data.meetingPlanId;
                    // console.log("Meeting plan ID: " + meetingPlanId);

                    request("GET", `/common/get-user/${leaderId}`)
                        .then(response => {
                            this.setState(prevState => ({
                                userInfo: {
                                    ...prevState.userInfo,
                                    [leaderId]: response.data
                                }
                            }));
                        });

                    request("GET", `/common/get-meeting-plan/${meetingPlanId}`)
                        .then(response => {
                            this.setState(prevState => ({
                                meetingPlanInfo: {
                                    ...prevState.meetingPlanInfo,
                                    [meetingPlanId]: response.data
                                }
                            }));
                        });
                });
        });
    }

    handleTabChange = (tab) => {
        this.setState({ currentTab: tab });
    };

    openModal = (content) => {
        this.setState({
            isModalOpen: true,
            modalContent: content
        });
    };

    closeModal = () => {
        this.setState({
            isModalOpen: false,
            modalContent: ''
        });
    };

    render() {
        const { data, currentTab, groupInfo, userInfo, meetingPlanInfo, isModalOpen, modalContent } = this.state;

        const tabs = ["Wait for approve", "Accepted", "Canceled", "Finished"];
        const filteredMeetings = data.filter(meeting => meeting.state === currentTab);

        return (
            <div>
                <h1>Scheduled Events</h1>
                <div className="tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`tab ${currentTab === tab ? 'active' : ''}`}
                            onClick={() => this.handleTabChange(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="meetings">
                    {filteredMeetings.map(meeting => {
                        const group = groupInfo[meeting.groupId] || {};
                        const leader = userInfo[group.leaderId] || {};
                        const meetingPlan = meetingPlanInfo[group.meetingPlanId] || {};

                        const startTime = Array.isArray(meeting.startTime) ? meeting.startTime.join(':') : '';
                        const endTime = Array.isArray(meeting.endTime) ? meeting.endTime.join(':') : '';

                        return (
                            <div key={meeting.id} className="meeting rounded-more shadow">
                                <div className="meeting-time">
                                    <strong>{`start: ${startTime} - end: ${endTime}`}</strong>
                                </div>
                                <div className="meeting-plan">
                                    {meetingPlan.name || 'No meeting plan'}
                                </div>
                                <div className="leader-name">
                                    {leader.name || 'No leader'}
                                </div>
                                <div className="options">
                                    <button onClick={() => this.openModal(meeting.report)}>{viewIcon}</button>
                                    <button>{editIcon}</button>
                                    <button>{deleteIcon}</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Meeting Report"
                >
                    <h2>Meeting Report</h2>
                    <div>{modalContent}</div>
                    <button onClick={this.closeModal}>Close</button>
                </Modal>
            </div>
        );
    }
}
