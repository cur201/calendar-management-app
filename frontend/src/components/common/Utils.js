import React from 'react';
import { useNavigate } from 'react-router-dom';


const withNavigate = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    return <WrappedComponent {...props} navigate={navigate} />;
  };
};

export default withNavigate;
