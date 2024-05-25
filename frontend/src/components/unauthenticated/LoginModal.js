import React from 'react';
import { Link } from 'react-router-dom';
import { Form, FormInput } from '../common/Form';
import withNavigate from '../common/Utils';
import { request, setAuthToken } from '../../axios_helper';
import useErrorToast from '../common/useErrorToast'; 

class _LoginModal extends Form {
    constructor(props) {
        super(props, "Login");
        this.content = (
            <div onSubmit={this.onSubmit}>
                <FormInput displayName="Username" name="username" />
                <FormInput displayName="Password" name="password" type="password" />
                <div className='line-break'></div>
                <div className='line-break'></div>
                <button type="submit" className="primary-button">Login</button>
                <div className='line-break'></div>
                <span>Not registered? <Link to='/signup'>Create an account</Link></span>
            </div>
        );
    
        this.state = {
            username: "",
            password: "",
        }
    }

    onSubmit = (e) => {
        var data = new FormData(e.target)
        const username = data.get('username');
        const password = data.get('password');
        e.preventDefault();
        request(
            "POST",
            "/login",
            { username: username, password: password }
        ).then((response) => {
            this.props.navigate("/dashboard");
            setAuthToken(response.data.token);
        }).catch((error) => {
            setAuthToken(null);
            this.props.showErrorToast("Invalid username or password.");
        });
    };

    render() {
        return (
            <div className='form-container'>
                <h1>{this.name}</h1>
                <div className='line-break'></div>
                <form onSubmit={this._onSubmit}>
                    {this.content}
                </form>
            </div>
        );
    }
}

const LoginModalWithNavigate = withNavigate(_LoginModal);

const LoginModal = (props) => {
    const [showErrorToast, ErrorToastComponent] = useErrorToast();

    return (
        <div>
            <LoginModalWithNavigate showErrorToast={showErrorToast} {...props} />
            <ErrorToastComponent /> {/* Include Toast component */}
        </div>
    );
};

export default LoginModal;
