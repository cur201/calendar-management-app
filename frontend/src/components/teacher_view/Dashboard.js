import { NavItem } from '../common/NavBar';
import Dashboard from '../common/Dashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faCalendarCheck, faUserGroup, faBell } from '@fortawesome/free-solid-svg-icons'
import MeetingPlan from '../common/MeetingPlan';


const meetingIcon = <FontAwesomeIcon icon={faCalendarDays} />
const eventIcon = <FontAwesomeIcon icon={faCalendarCheck} />
const studentIcon = <FontAwesomeIcon icon={faUserGroup} />
const notiIcon = <FontAwesomeIcon icon={faBell} />


export default class TeacherDashboard extends Dashboard {
    constructor(props) {
        super(props);
        const items = [
            <NavItem icon={meetingIcon} title={"Meeting plans"}/>,
            <NavItem icon={eventIcon} title={"Scheduled events"}/>,
            <NavItem icon={studentIcon} title={"Students"}/>,
            <NavItem icon={notiIcon} title={"Notifications"}/>,
        ];

        // var items = [
        //     NavItem("calendar-days", "Meeting plans"),
        //     NavItem("calendar-check", "Scheduled events"),
        //     NavItem("user-group", "Students"),
        //     NavItem("bell", "Notifications"),
        // ]
        //super(props, { items });
        this.state = {
            componentToShow: "meetingplan"
        };
        this.items = items;
    };

    render () {
        return (
            // <div>
            //     <Dashboard items={this.items} />
            //     {this.state.componentToShow === "meetingplan" && <MeetingPlan/>}
            // </div>
            <Dashboard items={this.items} componentToShow={this.state.componentToShow} />
        );
    };
}
