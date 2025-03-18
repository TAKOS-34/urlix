import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-logo">
                <Link to="/" className="logo">URLIX</Link>
                <div className="copyright">URLIX © Copyright {new Date().getFullYear()}</div>
            </div>

            <div className="footer-nav">
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/api">API</Link></li>
                    <li><Link to="/faq">FAQ</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>

                <div className="separator"></div>

                <ul className="nav-confidentiality-donate">
                    <li><Link to="/confidentiality">Confidentiality</Link></li>
                    <li><Link to="/donate">Donate</Link></li>
                    <li><a href="https://github.com" target="_blank">Source code</a></li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;