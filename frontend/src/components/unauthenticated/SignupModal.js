import React from "react";
import { Link } from "react-router-dom";
import { Form, FormInput } from "../common/Form";
import withNavigate from "../common/Utils";
import { request, setAuthToken } from "../../axios_helper";
import useErrorToast from "../common/useErrorToast";

class _SignupModal extends Form {
    constructor(props) {
        super(props, "Sign up");
        this.state = {
            name: "",
            username: "",
            password: "",
            role: "STUDENT", // default value
        };
    }

    UNSAFE_componentWillMount() {
        console.log("MOUNTING");
        this.content = (
            <div>
                <FormInput
                    displayName="Name"
                    name="name"
                    onChange={this.onChange}
                />
                <FormInput
                    displayName="Username"
                    name="username"
                    onChange={this.onChange}
                />
                <FormInput
                    displayName="Password"
                    name="password"
                    type="password"
                    onChange={this.onChange}
                />
                <div>
                    <b>Select role:</b>
                    <input type="radio" name="role" value="STUDENT" id="r-student" onChange={this.onChange} defaultChecked/>
                    <label for="r-student">Student</label>
                    <input type="radio" name="role" value="TEACHER" id="r-teacher" onChange={this.onChange}/>
                    <label for="r-teacher">Teacher</label>
                </div>
                <div className="line-break"></div>
                <div className="line-break"></div>
                <button type="submit" className="primary-button" onClick={this.onSubmit}>
                    Sign up
                </button>
                <div className="line-break"></div>
                <div className="line-break"></div>
                <span>
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </div>
        );
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const { name, username, password, role } = this.state;

        console.log({ username, password });

        request("POST", `/register`, { name, username, password, role })
            .then((response) => {
                console.log(response.data);
                const { id, name, token, role } = response.data;
                setAuthToken(token);
                localStorage.setItem("userId", id);
                localStorage.setItem("userName", name);
                localStorage.setItem("userToken", token);
                localStorage.setItem("userRole", role);
                this.props.navigate("/dashboard", { replace: true });
            })
            .catch((error) => {
                setAuthToken(null);
                this.props.showErrorToast("This account already exist.");
            });
    };
}

const SignupModalwithNavigate = withNavigate(_SignupModal);

const SignupModal = (props) => {
    const [showErrorToast, ErrorToastComponent] = useErrorToast();

    return (
        <div>
            <SignupModalwithNavigate
                showErrorToast={showErrorToast}
                {...props}
            />
            <ErrorToastComponent /> {/* Include Toast component */}
        </div>
    );
};

export default SignupModal;
