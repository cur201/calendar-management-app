import { request, setAuthToken } from '../../axios_helper';
import Event from '../common/Event';
import Modal from 'react-modal';
import AddMeetingModal from './AddMeetingModal';

export default class TeacherEvent extends Event {    
    state = {
        ...this.state,
        isModalOpen: false,
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

    openModal = () => {
        this.setState({ isModalOpen: true });
    }

    closeModal = () => {
        this.setState({ isModalOpen: false });
        this.componentDidMount(); // Refresh the page
    }

    render() {
        return (
            <div>
                <button onClick={this.openModal}>Add Meeting</button>
                <Modal
                    isOpen={this.state.isModalOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Add Meeting"
                >
                    <AddMeetingModal closeModal={this.closeModal} />
                </Modal>
                {super.render()}
            </div>
        );
    }
}