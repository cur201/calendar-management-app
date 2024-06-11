import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./PopUpModal.css";

class PopUpModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { onClose } = this.props;
        return (
            <div className="popup-form">
                <div className="popup-inner rounded-more soft-shadow">
                    <div className="popup-titlebar">
                        <h2>{this.props.title}</h2>
                        <button className="popup-close-button" onClick={onClose} >
                            <FontAwesomeIcon icon={faXmark}/>
                        </button>
                    </div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default PopUpModal;
