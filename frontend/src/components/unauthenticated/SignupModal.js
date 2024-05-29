import React from "react";
import { Link } from "react-router-dom";
import { Form, FormInput } from "../common/Form";
import withNavigate from "../common/Utils";
import { request, setAuthToken } from "../../axios_helper";
import useErrorToast from "../common/useErrorToast";

class _LoginModal extends Form {
    constructor(props) {
        super(props, "Sign up");
        this.state = {
            username: "",
            password: "",
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
                    <input type="radio" name="role" value="student" id="r-student"/>
                    <label for="r-student">Student</label>
                    <input type="radio" name="role" value="teacher" id="r-teacher"/>
                    <label for="r-teacher">Teacher</label>
                </div>
                <div className="line-break"></div>
                <div className="line-break"></div>
                <button type="submit" className="primary-button">
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

    onSubmit = (e) => {
        const { username, password } = this.state;

        console.log({ username, password });

        request("POST", `/login`, { username, password })
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
                this.props.showErrorToast("Invalid username or password.");
            });
    };
}

const SignupModal = withNavigate(_LoginModal);

export default SignupModal;
