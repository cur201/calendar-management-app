import { Link } from 'react-router-dom';
import { Form, FormInput } from '../common/Form';


export default class SignupModel extends Form {
    constructor(props) {
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
        super(props, "Sign up", content);
        this.state = {
            name: "",
            username: "",
            password: "",
        }
    }

    onSubmit = (e) => {
        console.log("Sign up.")
    }
}
