import React, { useState } from "react";
import { useAuth } from "../AuthProvider";
import { Link } from "react-router-dom";
import '../../styles/Header/Header.css';
import home from '../../assets/images/home.png';
import api from '../../assets/images/api.png';
import faq from '../../assets/images/faq.png';
import contact from '../../assets/images/contact.png';
import signUp from '../../assets/images/sign-up.png';
import account from '../../assets/images/account.png';
import newUrl from '../../assets/images/new.png';
import logout from '../../assets/images/sign-out.png';
import mobileMenu from '../../assets/images/mobile-menu.png';
import crossIcon from '../../assets/images/cross.png';

function Header() {
    const { isLoggedIn } = useAuth();
    const [openMobileMenu, setOpenMobileMenu] = useState(false);

    const deconnexion = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(() => {
                setTimeout(() => { window.location.href = '/'; }, 100)
            })
            .catch(err => console.error(err));
    };

    return (
        <>
            <header className="header">
                <div className="navbar-logo">
                    <Link to="/"><div className="logo">URLIX</div></Link>
                </div>

                <div className="navbar-div">
                    <img
                        src={openMobileMenu ? crossIcon : mobileMenu}
                        alt="Mobile Menu Icon"
                        className={`mobile-menu-icon ${openMobileMenu ? 'cross-icon' : 'hamburger-icon'}`}
                        onClick={() => setOpenMobileMenu(!openMobileMenu)}
                    />

                    <nav className={`navbar ${openMobileMenu ? 'open' : ''}`}>
                        <ul>
                            <li>
                                <Link to="/"><img src={home} alt="Home Icon" className="home-icon" />Home</Link>
                            </li>
                            <li>
                                <Link to="/api"><img src={api} alt="API Icon" className="api-icon" />API</Link>
                            </li>
                            <li>
                                <Link to="/faq"><img src={faq} alt="FAQ Icon" className="faq-icon" />FAQ</Link>
                            </li>
                            <li>
                                <Link to="/contact"><img src={contact} alt="Contact Icon" className="contact-icon" />Contact</Link>
                            </li>
                            <li className="separator-icon"></li>
                            {isLoggedIn ? (
                                <>
                                    <li>
                                        <Link to="/account/short-url"><img src={newUrl} alt="New URL Icon" className="new-url-icon" />Short URL</Link>
                                    </li>
                                    <li>
                                        <Link to="/account/informations"><img src={account} alt="Account Icon" className="account-icon" />Account</Link>
                                    </li>
                                    <li>
                                        <a onClick={deconnexion} style={{ cursor: 'pointer' }}>
                                            <img src={logout} alt="Logout Icon" className="logout-icon" />Logout
                                        </a>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/login"><img src={account} alt="Login Icon" className="login-icon" />Login</Link>
                                    </li>
                                    <li>
                                        <Link to="/signup"><img src={signUp} alt="Sign Up Icon" className="sign-up-icon" />Sign Up</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}

export default Header;