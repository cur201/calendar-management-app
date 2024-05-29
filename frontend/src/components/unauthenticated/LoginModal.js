import React from "react";
import { Link } from "react-router-dom";
import { Form, FormInput } from "../common/Form";
import withNavigate from "../common/Utils";
import { request, setAuthToken } from "../../axios_helper";
import useErrorToast from "../common/useErrorToast";

class _LoginModal extends Form {
    constructor(props) {
        super(props, "Login");
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
                <div className="line-break"></div>
                <button type="submit" className="primary-button">
                    Login
                </button>
                <div className="line-break"></div>
                <div className="line-break"></div>
                <span>
                    Not registered? <Link to="/signup">Create an account</Link>
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
                this.props.roleSetter(role);
                this.props.navigate("/dashboard", { replace: true });
            })
            .catch((error) => {
                setAuthToken(null);
                this.props.showErrorToast("Invalid username or password.");
            });
    };
}

const LoginModalWithNavigate = withNavigate(_LoginModal);

const LoginModal = (props) => {
    const [showErrorToast, ErrorToastComponent] = useErrorToast();

    return (
        <div>
            <LoginModalWithNavigate
                showErrorToast={showErrorToast}
                {...props}
            />
            <ErrorToastComponent /> {/* Include Toast component */}
        </div>
    );
};

export default LoginModal;
