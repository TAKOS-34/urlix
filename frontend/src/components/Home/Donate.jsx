import React from 'react';
import '../../styles/Home/Donate.css';
import PaypalLogo from '../../assets/images/paypal-logo.png'
import { Helmet } from 'react-helmet-async';

function Donate() {
    return (
        <div className="container-donate">
            <Helmet>
                <title>URLIX | Donate</title>
                <meta name="description" content="Support URLIX - Consider making a donation to help keep our free URL shortener service running and evolving." />
            </Helmet>
            <div className="donate-title">Donate | Support the project</div>

            <div className="donate-content">
                I built this free URL shortener in my spare time as a student to improve my skills. If you find it useful, consider making a donation! Every contribution goes directly back into the project—whether it's upgrading the server, improving features, or covering operational costs. Your support helps keep this service running and evolving. Thank you!
            </div>

            <a href="https://paypal.me/FncTAKOS" target='_blank' className="donate-btn">
                <img src={PaypalLogo} alt="Paypal Logo" className="donate-paypal-logo"/>
                Donate on Paypal
            </a>
        </div>
    );
}

export default Donate;