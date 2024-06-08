import { request, setAuthToken } from '../../axios_helper';
import Event from '../common/Event';
import Modal from 'react-modal';
import AddMeetingModal from './AddMeetingModal';

export default class TeacherEvent extends Event {    
    state = {
        ...this.state,
        isAddMeetingModalOpen: false,
    };

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

    deleteMeeting = (meetingId) => {
        request("DELETE", `/teacher/delete-meeting/${meetingId}`)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error deleting meeting:", error);
            });
    }

    openAddMeetingModal = () => {
        this.setState({ isAddMeetingModalOpen: true });
    }

    closeAddMeetingModal = () => {
        this.setState({ isAddMeetingModalOpen: false });
        this.componentDidMount(); // Refresh the page
    }

    render() {
        return (
            <div>
                <button onClick={this.openAddMeetingModal}>Add Meeting</button>
                <Modal
                    isOpen={this.state.isAddMeetingModalOpen}
                    onRequestClose={this.closeAddMeetingModal}
                    contentLabel="Add Meeting"
                >
                    <AddMeetingModal closeModal={this.closeAddMeetingModal} />
                </Modal>
                {super.render()}
            </div>
        );
    }
}
