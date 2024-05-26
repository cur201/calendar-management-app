import * as React from 'react';
import { request, setAuthToken } from '../../axios_helper';
import "./Event.css";

export default class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentPage: 0,
            currentTab: 'Wait for approve',
            groupInfo: {},
            userInfo: {},
            meetingPlanInfo: {}
        };
    }

    componentDidMount() {
        const userRole = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('userToken');

        let url = '';
        if (userRole === 'STUDENT') {
            url = `/student/get-meeting-by-student-id/${userId}`;
        } else if (userRole === 'TEACHER') {
            url = `/teacher/get-meeting-by-owner-user-id`;
        }

        if (url) {
            request("GET", url, null, { Authorization: `Bearer ${token}` })
                .then((response) => {
                    this.setState({ data: response.data }, this.fetchAdditionalData);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        setAuthToken(null);
                    } else {
                        this.setState({ data: error.response.code });
                    }
                });
        }
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
                    console.log("Leader ID: " + leaderId);
                    const meetingPlanId = response.data.meetingPlanId;
                    console.log("Meeting plan ID: " + meetingPlanId);

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

    render() {
        const { data, currentTab, groupInfo, userInfo, meetingPlanInfo } = this.state;

        const tabs = ["Wait for approve", "Accepted", "Canceled", "Finished"];
        const filteredMeetings = data.filter(meeting => meeting.state === currentTab);

        return (
            <div>
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
                            <div key={meeting.id} className="meeting">
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
                                    <button onClick={() => alert(meeting.report)}>View Report</button>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
