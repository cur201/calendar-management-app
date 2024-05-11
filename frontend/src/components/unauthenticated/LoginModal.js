import { Link } from 'react-router-dom';
import { Form, FormInput } from '../common/Form';
import withNavigate from '../common/Utils'


class _LoginModal extends Form {
    constructor(props) {
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
        super(props, "Login", content);
        this.state = {
            username: "",
            password: "",
        }
    }

    onSubmit = (e) => {
        this.props.navigate("/dashboard");
    };
}


const LoginModal = withNavigate(_LoginModal);

export default LoginModal
