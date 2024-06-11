import React from "react";
import _Select from "react-select";
import './Select.css';

const Select = ({ children, onChange }) => {
    const options = React.Children.map(children, (child) => ({
        value: child.props.value,
        label: child.props.children,
    }));

    return <_Select options={options} onChange={onChange} unstyled classNamePrefix="custom-select"/>;
};

export default Select;
