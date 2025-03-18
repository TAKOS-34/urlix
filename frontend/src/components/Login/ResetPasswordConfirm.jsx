import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../AuthProvider';
import InformationMessage from '../InformationMessage';
import '../../styles/LoginSignUp/AccountForm.css';
import showIcon from '../../assets/images/show.png';
import hideIcon from '../../assets/images/hide.png';

function SignUp() {
    const { isLoggedIn, loading } = useAuth();
    const { token } = useParams();
    const navigate = useNavigate();
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
                document.title = `URLY | Reset Password`;
            }
        }
    }, [isLoggedIn]);

    const handleSignUp = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/resetPasswordConfirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password, passwordConfirm })
        })
            .then(res => res.json())
            .then(res => {
                setInformationMessage({ text: res.message, color: res.status ? 'green' : 'red' });
                if (res.status) {
                    setPassword('');
                    setPasswordConfirm('');
                    setTimeout(() => { navigate('/login'); }, 3000);
                } else {
                    setTimeout(() => { setInformationMessage({ text: '', color: '' }) }, 5000);
                    setPassword('');
                    setPasswordConfirm('');
                }
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container-account-form">
            <form className="account-form" onSubmit={handleSignUp}>

                <div className="account-form-title">Reset your password</div>

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

                {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}

                <div className="reset-password-btn"><button type="submit">Reset your password</button></div>

            </form>
        </div>
    );
}

export default SignUp;