import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../AuthProvider';
import InformationMessage from '../InformationMessage';
import '../../styles/LoginSignUp/AccountForm.css';
import emailIcon from '../../assets/images/email.png';

function ResetPassword() {
    const { isLoggedIn, loading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });

    useEffect(() => {
        if (!loading) {
            if (isLoggedIn) {
                navigate('/');
            } else {
                document.title = `URLY | Reset Password`;
            }
        }
    }, [isLoggedIn]);

    const handleForgotPassword = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/resetPassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(res => {
                setInformationMessage({ text: res.message, color: res.status ? 'green' : 'red' });
                setEmail('');
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container-account-form">
            <form className="account-form" onSubmit={handleForgotPassword}>

                <div className="account-form-title">Forgot Your Password</div>

                <div className="account-form-input">
                    <input
                        type="email"
                        minLength="4"
                        maxLength="320"
                        pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <img src={emailIcon} alt="Email Icon" className="account-form-input-icon" />
                </div>

                <div className="redirection-message">
                    <Link to="/login">Click here to login</Link>
                </div>

                {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}

                <div className="reset-password-btn"><button type="submit">Send reset password Email</button></div>

            </form>
        </div>
    )
}

export default ResetPassword;