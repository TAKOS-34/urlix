import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../AuthProvider';
import InformationMessage from '../InformationMessage';
import '../../styles/LoginSignUp/AccountForm.css';
import emailIcon from '../../assets/images/email.png';
import passwordIcon from '../../assets/images/password.png';

function Login() {
    const { isLoggedIn, loading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });
    const [showResendEmailButton, setShowResendEmailButton] = useState(false);
    const [informationMessage2, setInformationMessage2] = useState({ text: '', color: '' });

    useEffect(() => {
        if (!loading) {
            if (isLoggedIn) {
                navigate('/');
            } else {
                document.title = `URLY | Login`;
            }
        }
    }, [isLoggedIn]);

    const handleResendEmail = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/resendEmail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(res => {
                setInformationMessage2({ text: res.message, color: res.status ? 'green' : 'red' });
                setTimeout(() => { setInformationMessage2(''); }, 10000);
            })
            .catch(err => console.error(err));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(res => {
                setInformationMessage({ text: res.message, color: res.status ? 'green' : 'red' });
                if (res.status) {
                    setEmail('');
                    setPassword('');
                    setTimeout(() => { window.location.href = '/account/informations'; }, 500);
                } else {
                    if (res.message === 'You need to verify your email to connect') {
                        setShowResendEmailButton(true);
                    } else {
                        setTimeout(() => { setInformationMessage({ text: '', color: '' }) }, 5000);
                        setPassword('');
                    }
                }
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container-account-form">
            <form className="account-form " onSubmit={handleLogin}>

                <div className="account-form-title">Login</div>

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

                <div className="account-form-input">
                    <input
                        type="password"
                        minLength="8"
                        maxLength="256"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <img src={passwordIcon} alt="Password Icon" className="account-form-input-icon" />
                </div>

                <div>
                    <div className="redirection-message"><Link to="/signup">Don't have an account yet ? Click here to sign up</Link></div>
                    <div className="redirection-message"><Link to="/reset-password">Forgot your password ? Click here</Link></div>
                </div>

                {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}

                <button type="submit">Login</button>
            </form>

            {showResendEmailButton && (
                <div className="container-resend-email">
                    {informationMessage2.text && <InformationMessage message={{ text: informationMessage2.text, color: informationMessage2.color }} />}
                    <button onClick={handleResendEmail}>Resend Confirmation Email</button>
                </div>
            )}

        </div>
    );
}

export default Login;