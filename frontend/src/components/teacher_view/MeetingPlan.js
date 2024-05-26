import { request, setAuthToken } from '../../axios_helper';
import MeetingPlan from '../common/MeetingPlan';

export default class TeacherMeetingPlan extends MeetingPlan{
    componentDidMount() {
        request(
            "GET",
            "/teacher/get-plans",
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
}
