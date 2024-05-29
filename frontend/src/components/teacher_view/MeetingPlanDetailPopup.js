import React from 'react';
import { request, setAuthToken } from '../../axios_helper';
import MeetingPlanDetailPopup from '../common/MeetinPlanDetailPopup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus 
} from "@fortawesome/free-solid-svg-icons";
import "./MeetingPlan.css";
import MeetingPlanPopupForm from './MeetingPlanPopupForm';
import { ToastContainer } from 'react-toastify';


export default class TeacherMeetingPlanDetailPopup extends MeetingPlanDetailPopup{
}