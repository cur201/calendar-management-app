import * as React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock
  } from "@fortawesome/free-solid-svg-icons";
import "./MeetingPlan.css"
import MeetingPlanDetailPopup from './MeetinPlanDetailPopup';

const clockIcon = <FontAwesomeIcon icon={faClock} />;

export default class MeetingPlan extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            currentPage: 0,
            selectedMeetingPlan: null,
        };
    };

    renderMeetingPlans() {
        const { data, currentPage } = this.state;
        const itemsPerPage = 12; //max item per page
        const startIndex = currentPage * itemsPerPage;
        const selectedItems = data.slice(startIndex, startIndex + itemsPerPage);

        const gridItems = selectedItems.map((item, index) => (
            <div className="grid-item rounded-more clickable shadow" key={index}>
                <h3>{item.name}</h3>
                <div className="duration">
                    {clockIcon} <div className="spacing"></div> {item.duration}
                </div>
                <div className="location"><b>Location:</b> {item.location}</div>
                {/* <p>{item.description}</p> */}
            </div>
        ));

        return (
            <div className="grid-container">
                {gridItems}
            </div>
        );
    }

    handlePrevPage = () => {
        this.setState((prevState) => ({
            currentPage: Math.max(prevState.currentPage - 1, 0)
        }));
    };

    handleNextPage = () => {
        const { data, currentPage } = this.state;
        const itemsPerPage = 12;
        const totalPages = Math.ceil(data.length / itemsPerPage);

        this.setState((prevState) => ({
            currentPage: Math.min(prevState.currentPage + 1, totalPages - 1)
        }));
    };

    handleItemClick = (meetingPlan) => {
        this.setState({ selectedMeetingPlan: meetingPlan });
    };

    closeDetailPopup = () => {
        this.setState({ selectedMeetingPlan: null });
    };

    render() {
        const { data, currentPage, selectedMeetingPlan } = this.state;
        const itemsPerPage = 12;
        const totalPages = Math.ceil(data.length / itemsPerPage);

        return (
            <div>
                {this.renderMeetingPlans()}
                <div className="pagination-controls">
                    <button onClick={this.handlePrevPage} disabled={currentPage === 0}>
                        Previous
                    </button>
                    <button onClick={this.handleNextPage} disabled={currentPage === totalPages - 1}>
                        Next
                    </button>
                </div>
                {selectedMeetingPlan &&
                    <MeetingPlanDetailPopup
                        meetingPlan={selectedMeetingPlan}
                        onClose={this.closeDetailPopup}
                    />
                }
            </div>
        );
    }

}
