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


export const Form = ({ name, content }) => {
    return (
        <div className='form-container'>
            <h1>{name}</h1>
            <div className='line-break'></div>
            <form>
                {content}
            </form>
        </div>

    )
}
