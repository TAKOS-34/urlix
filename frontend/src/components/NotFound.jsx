import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';
import { Helmet } from 'react-helmet-async';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="container-not-found">
            <Helmet>
                <title>URLIX | Page not found</title>
                <meta name="description" content="The page you are looking for does not exist." />
            </Helmet>
            <div className="not-found-title">
                This page doesn't exist. Please go back to the main menu
            </div>
            <button className="not-found-btn" onClick={() => { navigate('/'); }}>Go back to the main menu</button>
        </div>
    );
}

export default NotFound;