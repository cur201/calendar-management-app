import { request, setAuthToken } from '../../axios_helper';
import MeetingPlan from '../common/MeetingPlan';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus
} from "@fortawesome/free-solid-svg-icons";
import "./MeetingPlan.css";

export default class TeacherMeetingPlan extends MeetingPlan{

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            searchTerm: '',
        };
    }

    componentDidMount() {
        request(
            "GET",
            `/teacher/get-plans`,
            null,
        ).then((response) => {
            this.setState({data: response.data})
        }).catch((error) => {
            if (error.response.status === 401) {
                setAuthToken(null);
            } else {
                this.setState({data: error.response.code})
            }
        });
    }

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    }

    handleSearchSubmit = () => {
        const { searchTerm } = this.state;
        const ownerUserId = localStorage.getItem("userId");
        console.log("Searching for:", searchTerm, "with ownerUserId:", ownerUserId);
    
        request(
            "GET",
            `/teacher/search-meeting-plan-teacher?query=${searchTerm}&ownerUserId=${ownerUserId}`,
            null,
        ).then((response) => {
            this.setState({ data: response.data });
        }).catch((error) => {
            if (error.response.status === 401) {
                setAuthToken(null);
            } else {
                this.setState({ data: error.response.code });
            }
        });
    }

    handleCreateNew = () => {
        console.log("Create new meeting plan");
    }

    render() {
        const { searchTerm } = this.state;

        return (
            <div>
                <div className="top-controls">
                    <div className="search-container">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm} 
                            onChange={this.handleSearchChange} 
                        />
                        <button onClick={this.handleSearchSubmit}>Search</button>
                    </div>
                    <button className="create-button" onClick={this.handleCreateNew}>
                        <FontAwesomeIcon icon={faPlus} /> Create New
                    </button>
                </div>
                {super.render()}
            </div>
        );
    }
}
