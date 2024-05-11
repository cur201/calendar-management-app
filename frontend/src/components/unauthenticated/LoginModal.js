import React from 'react';
import { Link } from 'react-router-dom';
import { Form, FormInput } from '../common/Form';


export default class LoginModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }
    }

    render() {
        var content = (
            <div>
                <FormInput displayName="Username" name="username" />
                <FormInput displayName="Password" name="password" type="password" />
                <div className='line-break'></div>
                <div className='line-break'></div>
                <button type="submit" className="primary-button">Login</button>
                <div className='line-break'></div>
                <span>Not registered? <Link to='/signup'>Create an account</Link></span>
            </div>
        )
        return (
            <Form name="Login" content={content} />
        )
    }
}
