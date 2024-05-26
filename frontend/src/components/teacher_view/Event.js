import { request, setAuthToken } from '../../axios_helper';
import Event from '../common/Event';

export default class TeacherEvent extends Event {
    componentDidMount() {
        request(
            "GET",
            `/teacher/get-meeting-by-owner-user-id`,
            null,
        ).then((response) => {
            this.setState({ data: response.data }, this.fetchAdditionalData);
        }).catch((error) => {
            if (error.response.status === 401) {
                setAuthToken(null);
            } else {
                this.setState({ data: error.response.code });
            }
        });
    }
}