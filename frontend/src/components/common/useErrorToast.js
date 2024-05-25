import { useState } from 'react';
import ErrorToast from './ErrorToast';

const useErrorToast = () => {
    const [toastData, setErrorToastData] = useState({ event: null, message: '' });

    const showErrorToast = (message) => {
        const event = new Date().getTime(); 
        setErrorToastData({ event, message });
    };

    const ErrorToastComponent = () => <ErrorToast event={toastData.event} message={toastData.message} />;

    return [showErrorToast, ErrorToastComponent];
};

export default useErrorToast;
