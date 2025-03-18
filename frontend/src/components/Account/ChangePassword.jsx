import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InformationMessage from '../InformationMessage';
import '../../styles/Account/ChangePassword.css';

function ChangePassword() {
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });
    document.title = 'URLIX | Change password';

    const handleChangePassword = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/changePassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                setInformationMessage({ text: res.message, color: res.status ? 'green' : 'red' });
                if (res.status) {
                    setTimeout(() => { window.location.href = '/'; }, 2000);
                }
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container-change-password">
            <div className="change-password-title">Change password</div>
            <div className="change-password-text">
                If you want to change your password, click on the button below.
                Then we'll send you an email with a clickable link, and you'll be logged out.
                Click on the link, and you'll be able to change your password.
            </div>

            {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}
            <div className="container-change-password-btn">
                <button className="change-password-btn" onClick={() => { handleChangePassword(); }}>
                    Send reset password email & disconnect yourself
                </button>
            </div>

            <div className="change-password-text">
                <Link to="/contact">For more information, or if you encounter a problem, please contact us</Link>
            </div>
        </div>
    );
}

export default ChangePassword;