import React from 'react';
import { Link } from 'react-router-dom';
import { Form, FormInput } from '../common/Form';


export default class SignupModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            username: "",
            password: "",
        }
    }

    render() {
        var content = (
            <div>
                <FormInput displayName="Name" name="name" />
                <FormInput displayName="Username" name="username" />
                <FormInput displayName="Password" name="password" type="password" />
                <div className='line-break'></div>
                <div className='line-break'></div>
                <button type="submit" className="primary-button">Sign up</button>
                <div className='line-break'></div>
                <span>Already have an account? <Link to='/login'>Login</Link></span>
            </div>
        )
        return (
            <Form name="Signup" content={content}/>
        )
    }
}
