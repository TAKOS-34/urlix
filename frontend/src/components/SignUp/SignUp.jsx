import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../AuthProvider';
import InformationMessage from '../InformationMessage';
import '../../styles/LoginSignUp/AccountForm.css';
import emailIcon from '../../assets/images/email.png';
import showIcon from '../../assets/images/show.png';
import hideIcon from '../../assets/images/hide.png';

function SignUp() {
    const { isLoggedIn, loading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });

    useEffect(() => {
        if (!loading) {
            if (isLoggedIn) {
                navigate('/');
            } else {
                document.title = `URLY | Sign Up`;
            }
        }
    }, [isLoggedIn]);

    const handleSignUp = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/signUp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, passwordConfirm })
        })
            .then(res => res.json())
            .then(res => {
                setInformationMessage({ text: res.message, color: res.status ? 'green' : 'red' });
                if (res.status) {
                    setEmail('');
                    setPassword('');
                    setPasswordConfirm('');
                    setTimeout(() => { navigate('/login'); }, 10000);
                } else {
                    setTimeout(() => { setInformationMessage({ text: '', color: '' }) }, 5000);
                    setPassword('');
                    setPasswordConfirm('');
                }
            })
            .catch(err => console.error(err));
    }

    return (
        <div className="container-account-form">
            <form className="account-form" onSubmit={handleSignUp}>

                <div className="account-form-title">Sign Up</div>

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

                <div className="password-informations">Must be at least 8 characters with 1 number and special character</div>
                <div className="account-form-input">
                    <input
                        type={showPassword ? "text" : "password"}
                        minLength="8"
                        maxLength="256"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <img src={showPassword ? hideIcon : showIcon} alt="Password Icon" title={showPassword ? 'Hide password' : 'Show password'} className="account-form-input-icon-password" onClick={() => {setShowPassword(!showPassword)}} />
                </div>

                <div className="account-form-input">
                    <input
                        type={showPasswordConfirm ? "text" : "password"}
                        minLength="8"
                        maxLength="256"
                        placeholder="Confirm password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                    <img src={showPasswordConfirm ? hideIcon : showIcon} alt="Password Icon" title={showPasswordConfirm ? 'Hide password' : 'Show password'} className="account-form-input-icon-password" onClick={() => {setShowPasswordConfirm(!showPasswordConfirm)}} />
                </div>

                <div className="redirection-message">
                    <Link to="/login">Already have an account ? Click here to login</Link>
                </div>

                {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;