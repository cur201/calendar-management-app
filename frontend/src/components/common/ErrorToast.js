import React, { useState, useEffect } from 'react';
import './ErrorToast.css';

const ErrorToast = ({ message, event }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (event) {
            // Show toast with delay
            setTimeout(() => {
                setVisible(true);
            }, 200); // Show toast gradually in 0.5 seconds
            
            // Hide toast after 3 seconds
            const timer = setTimeout(() => {
                setVisible(false);
            }, 3500); // Hide after 3 seconds (500ms + 3000ms)
            
            return () => clearTimeout(timer);
        }
    }, [event]);

    return (
        <div className={`toast ${visible ? 'fade-in-out' : ''}`}>
            {message}
        </div>
    );
};

export default ErrorToast;
