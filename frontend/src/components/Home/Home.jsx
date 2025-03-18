import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home/Home.css';

function Home() {
    document.title = 'URLIX | Home';

    return (
        <div className="container-home">
            <div className="home-header-title">Welcome to URLIX</div>
            <div className="home-header-content">
                Your free and unlimited URL shortener service. Easily shorten long URLs into compact, shareable links and track redirection statistics — all in one place
            </div>

        <div className="home-section">
            <div className="home-section-title">Features at a Glance</div>
            <div className="home-section-content">
                <ul>
                    <li>Shorten long URLs to a simpler format</li>
                    <li>Customize the slug to create memorable links</li>
                    <li>Secure your links with password protection and set expiration dates</li>
                    <li>Generate QR codes for each URL for quick sharing</li>
                    <li>Monitor redirection statistics directly in your dashboard</li>
                    <li>Use advanced filters to manage and search your link.</li>
                    <li>Access your API key to integrate our service into your apps (no usage limits)</li>
                </ul>
            </div>
        </div>

        <div className="home-section">
            <div className="home-section-title">How It Works</div>
            <div className="home-section-content">
                Simply sign up with a valid email address and verify your account. Once logged in, you can create new short URLs from your dashboard, customize them, and even assign internal names for easier management
            </div>
            <div className="home-section-content">
                Manage your URLs, update your account details, and even change your email or password—all through our intuitive interface
            </div>
            <div className="home-section-content">
                For more details, check out our <Link to="/faq" className="home-section-btn">FAQ</Link> page
            </div>
        </div>

        <div className="home-section">
            <div className="home-section-title">Get Started</div>
            <div className="home-section-content">
                Create your account now and enjoy all the benefits of a powerful URL shortener : <Link to="/signup" className="home-section-btn">Sign Up</Link>
            </div>
        </div>
        </div>
    )
}

export default Home;