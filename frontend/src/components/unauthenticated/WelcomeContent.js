import * as React from 'react';

export default class WelcomeContent extends React.Component {
    render () {
        return (
            <div className='row justify-content-md-center'>
                <div className='jumbotron jumbotron-fluid'>
                    <div className='container'>
                        <h1 className='display-4'>Welcome to app</h1>
                    </div>
                </div>
            </div>
        );
    };
};