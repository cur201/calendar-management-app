import './unauthenticated/App.css'
import logo from '../logo.svg'
import Header from './unauthenticated/Header'
import AppContent from './unauthenticated/AppContent';

function App() {
    return (
        <div>
            <Header pageTitle = "Login" logoSrc={logo} />
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col'>
                        <AppContent/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;