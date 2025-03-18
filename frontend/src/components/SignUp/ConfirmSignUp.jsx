import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthProvider';
import { useParams } from 'react-router-dom';
import InformationMessage from '../InformationMessage';
import '../../styles/LoginSignUp/ConfirmSignUp.css';

function ConfirmSignUp() {
    const { isLoggedIn } = useAuth();
    const { token } = useParams();
    const navigate = useNavigate();
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        } else {
            document.title = `URLY | Confirm Sign Up`;
            fetch(`${process.env.REACT_APP_BACKEND_URL}/user/confirmSignUp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            })
                .then(res => res.json())
                .then(res => {
                    setInformationMessage({ text: res.message, color: res.status ? 'green' : 'red' });
                    if (res.status) {
                        setTimeout(() => { window.location.href = '/login'; }, 2000);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [isLoggedIn, navigate, token]);

    return (
        <div className="container-confirm-sign-up">
            <div className="container-information-message">
                {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}
            </div>
        </div>
    )
}

export default ConfirmSignUp;