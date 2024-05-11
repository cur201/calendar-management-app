import React from 'react';
import './Form.css'

export const FormInput = ({ displayName, name, type = "text" }) => {
    return (
        <div className='form-input'>
            {/* <label htmlFor={name}>{displayName}</label> */}
            <input placeholder={displayName} type={type} name={name}></input>
        </div>
    )
}


export class Form extends React.Component {
    constructor(props, name, content) {
        super(props);
        this.name = name
        this.content = content
    }

    onSubmit = (e) => { };

    _onSubmit = (e) => {
        e.preventDefault();
        this.onSubmit(e);
    };

    render() {
        return (
            <div className='form-container'>
                <h1>{this.name}</h1>
                <div className='line-break'></div>
                <form onSubmit={this.onSubmit}>
                    {this.content}
                </form>
            </div>

        )
    }
}
