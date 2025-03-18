import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InformationMessage from '../InformationMessage';
import '../../styles/Account/DeleteAccount.css';

function DeleteAccount() {
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });
    document.title = 'URLIX | Delete your account';

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account ? This action is irreversible !')) {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/user/deleteAccount`, {
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
        }
    };

    return (
        <div className="container-delete-account">
            <div className="delete-account-title">Delete your account</div>
            <div className="delete-account-text">
                If you want to delete your account, click on the button below.
                Remember that this action is irreversible!
                Please note that deleting your account will not automatically delete your associated URLs.
                If you want to delete your URLs, you must do so manually before deleting your account
            </div>

            {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}
            <div className="container-delete-account-btn">
                <button className="delete-account-btn" onClick={() => { handleDeleteAccount(); }}>
                    Delete your account
                </button>
            </div>

            <div className="delete-account-text">
                <Link to="/contact">For more information, or if you encounter a problem, please contact us</Link>
            </div>
        </div>
    );
}

export default DeleteAccount;