import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

function NotFound() {
    const navigate = useNavigate();
    document.title = `URLIX | Page not found`;

    return (
        <div className="container-not-found">
            <div className="not-found-title">
                This page doesn't exist. Please go back to the main menu
            </div>
            <button className="not-found-btn" onClick={() => { navigate('/'); }}>Go back to the main menu</button>
        </div>
    );
}

export default NotFound;