import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./MeetingPlan.css";
import MeetingPlanDetailPopup from "./MeetingPlanDetailPopup";
import MediaQuery from "react-responsive";

const clockIcon = <FontAwesomeIcon icon={faClock} />;

export default class MeetingPlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            searchTerm: "",
            currentPage: 0,
            selectedMeetingPlan: null,
            showPlans: [],
        };
    }

    componentDidMount() {
        this.fetchMeetingPlans();
    }

    fetchMeetingPlans() {}

    updateShowPlans() {
        const { data, currentPage } = this.state;
        const itemsPerPage = 12; //max item per page
        const startIndex = currentPage * itemsPerPage;
        const selectedItems = data.slice(startIndex, startIndex + itemsPerPage);

        this.setState({ showPlans: selectedItems }, () => {
            console.log(this.state);
            this.forceUpdate();
        });
    }

    handlePrevPage = () => {
        this.setState(
            (prevState) => ({
                currentPage: Math.max(prevState.currentPage - 1, 0),
            }),
            this.updateShowPlans
        );
    };

    handleNextPage = () => {
        const { data, currentPage } = this.state;
        const itemsPerPage = 12;
        const totalPages = Math.ceil(data.length / itemsPerPage);

        this.setState(
            (prevState) => ({
                currentPage: Math.min(prevState.currentPage + 1, totalPages - 1),
            }),
            this.updateShowPlans
        );
    };

    handleItemClick = (meetingPlan) => {
        this.setState({ selectedMeetingPlan: meetingPlan });
    };

    closeDetailPopup = () => {
        this.setState({ selectedMeetingPlan: null });
    };

    handleSearchChange(event) {}

    handleSearchSubmit() {}

    content() {}

    render() {
        const { data, currentPage, selectedMeetingPlan, searchTerm, showPlans } = this.state;
        const itemsPerPage = 12;
        const totalPages = Math.ceil(data.length / itemsPerPage);
        return (
            <div className="view-container">
                <div className="top-controls">
                    <h1>Meeting plans</h1>
                    <div className="spacing"></div>
                    <MediaQuery maxWidth={1224}>
                        {this.readOnly ? (
                            ""
                        ) : (
                            <button className="create-button circle-button" onClick={this.handleCreateNew}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        )}
                    </MediaQuery>
                    {this.searchable ? (
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={this.handleSearchChange}
                            />
                            <button onClick={this.handleSearchSubmit} className="circle-button">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                    <MediaQuery minWidth={1224}>
                        {this.readOnly ? (
                            ""
                        ) : (
                            <button className="create-button circle-button" onClick={this.handleCreateNew}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        )}
                    </MediaQuery>
                </div>
                <div>
                    <div className="grid-container">
                        {showPlans.map((item, index) => (
                            <div
                                className="grid-item rounded-more clickable shadow"
                                key={index}
                                onClick={() => this.handleItemClick(item)}
                            >
                                <h4>{item.name}</h4>
                                <div className="duration">
                                    {clockIcon} <div className="spacing"></div> {item.duration}
                                </div>
                                <div className="location">
                                    <b>Location:</b> {item.location}
                                </div>
                                {/* <p>{item.description}</p> */}
                            </div>
                        ))}
                    </div>
                    <div className="pagination-controls">
                        <button onClick={this.handlePrevPage} disabled={currentPage === 0}>
                            Previous
                        </button>
                        <button onClick={this.handleNextPage} disabled={currentPage === totalPages - 1}>
                            Next
                        </button>
                    </div>
                    {selectedMeetingPlan && (
                        <MeetingPlanDetailPopup
                            meetingPlan={selectedMeetingPlan}
                            onClose={this.closeDetailPopup}
                            readOnly={this.readOnly}
                        />
                    )}
                </div>
                {this.content()}
            </div>
        );
    }
}
