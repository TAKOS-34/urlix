import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InformationMessage from '../InformationMessage';
import '../../styles/Account/ChangeEmail.css';

function ChangeEmail() {
    const [newEmail, setNewEmail] = useState('');
    const [actualEmailToken, setActualEmailToken] = useState('');
    const [newEmailToken, setNewEmailToken] = useState('');
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });
    const [informationMessage2, setInformationMessage2] = useState({ text: '', color: '' });
    document.title = 'URLIX | Change email';

    const handleChangeEmailSendEmailTokens = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/changeEmail/sendEmailTokens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ newEmail })
        })
            .then(res => res.json())
            .then(res => {
                setInformationMessage({ text: res.message, color: res.status ? 'green' : 'red' });
                setTimeout(() => { setInformationMessage({ text: '', color: '' })}, 5000);
            })
            .catch(err => console.error(err));
    };

    const handleChangeEmailSendTokens = (e) => {
        if (window.confirm('Are you sure you want to change your email?')) {
            e.preventDefault();
            fetch(`${process.env.REACT_APP_BACKEND_URL}/user/changeEmail/sendTokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ actualEmailToken, newEmailToken })
            })
                .then(res => res.json())
                .then(res => {
                    setInformationMessage2({ text: res.message, color: res.status ? 'green' : 'red' });
                    if (res.status) {
                        setTimeout(() => { window.location.href = '/'; }, 2000);
                    }
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="container-change-email">
            <div className="change-email-title">Change email</div>
            <div className="change-email-text">
                If you want to change your email, click the button below.
                Then, we will send you two emails with two different tokens: 
                one to the email associated with your account and the other to the new email you want to use.
            </div>
            <form onSubmit={handleChangeEmailSendEmailTokens}>
                <input
                    type="email"
                    className="change-email-input"
                    minLength="4"
                    maxLength="320"
                    pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                    placeholder="New email you want to use"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    required
                />
                {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}
                <div className="container-change-email-btn">
                    <button className="change-email-btn" type="submit">
                        Send tokens to both emails
                    </button>
                </div>
            </form>

            <div className="change-email-text">
                In the inputs below, enter the tokens you received in the emails.
                The first token is the one sent to the email associated with your account,
                and the second token is the one sent to the new email you want to use.
            </div>
            <form onSubmit={handleChangeEmailSendTokens}>
                <input
                    type="text"
                    className="change-email-input"
                    minLength="255"
                    maxLength="255"
                    placeholder="Token associated with your account email"
                    value={actualEmailToken}
                    onChange={e => setActualEmailToken(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className="change-email-input"
                    minLength="255"
                    maxLength="255"
                    placeholder="Token associated with your new email"
                    value={newEmailToken}
                    onChange={e => setNewEmailToken(e.target.value)}
                    required
                />
                {informationMessage2.text && <InformationMessage message={{ text: informationMessage2.text, color: informationMessage2.color }} />}
                <div className="container-change-email-btn">
                    <button className="change-email-btn" type="submit">
                        Send change email request
                    </button>
                </div>
            </form>

            <div className="change-email-text">
                <Link to="/contact">For more information, or if you encounter a problem, please contact us</Link>
            </div>
        </div>
    );
}

export default ChangeEmail;