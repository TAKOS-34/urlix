import React from 'react';
import { Link } from 'react-router-dom';
import FaqBox from './FaqBox';
import '../../styles/Home/Faq.css';

function Faq() {
    document.title = 'URLIX | FAQ';

    return (
        <div className="container-faq">
            <div className="faq-title">FAQ – Frequently Asked Questions</div>

            <FaqBox title="1. What is a URL shortener ?">
                A URL shortener is a tool that converts a long web address into a shorter, more shareable version. This makes it easier to share links and track redirection statistics.
            </FaqBox>

            <FaqBox title="2. Is the service free ?">
                Yes, our service is completely free and unlimited. You can create and manage as many short URLs as you want.
            </FaqBox>

            <FaqBox title="3. Why do I need to create an account ?">
                To use our service, you must create an account using a valid email address. A verification email is required to ensure the security and integrity of your account.
            </FaqBox>

            <FaqBox title="4. How can I create a short URL ?">
                <p>
                    Once you are logged in (<Link to="/account/short-url">Account &gt; Short URL</Link>), you can:
                </p>
                <ul>
                    <li>- Create a short URL.</li>
                    <li>- Customize the slug after the "/" to make it memorable.</li>
                    <li>- Assign an internal name for easier management in your dashboard.</li>
                    <li>- Protect your redirection with a password and set an expiration date if needed.</li>
                </ul>
            </FaqBox>

            <FaqBox title="5. How do I manage my URLs ?">
                <p>
                    In the <Link to="/account/manage-url">Account &gt; Manage URL</Link> section, you can:
                </p>
                <ul>
                    <li>- Access all your short URLs.</li>
                    <li>- Search and filter your URLs using advanced filters.</li>
                    <li>
                    - For each URL, generate a QR code (downloadable as PNG), view redirection statistics, edit, or delete the link.
                    </li>
                </ul>
            </FaqBox>

            <FaqBox title="6. How can I generate and use my API key ?">
                <p>
                    After creating your account, navigate to <Link to="/account/manage-api">Account &gt; Manage API</Link> to generate your API key. It will be sent to your email
                </p>
                <p>
                    <strong>Important:</strong> Please keep this email safe, as the API key cannot be re-sent automatically. If lost, you will need to contact support for a replacement
                </p>
                <p>
                    The API documentation explains how to use your key without any usage limits and completely free
                </p>
            </FaqBox>

            <FaqBox title="7. Where can I view my account information ?">
                You can view and update your personal account details in the <Link to="/account/informations">Account &gt; Information</Link> section
            </FaqBox>

            <FaqBox title="8. How do I change my email address ?">
                To change your email address, go to <Link to="/account/change-email">Account &gt; Change Email</Link>. You will receive two tokens—one on your current email and one on your new email. Enter both tokens on the page to verify and confirm the change
            </FaqBox>

            <FaqBox title="9. How do I change my password ?">
                Visit <Link to="/account/change-password">Account &gt; Change Password</Link> to initiate a password change. Once the request is made, you will be logged out and receive further instructions via email
            </FaqBox>

            <FaqBox title="10. How do I delete my account ?">
                To delete your account, navigate to <Link to="/account/delete-my-account">Account &gt; Delete Account</Link>. Note that the URLs associated with your account will not be deleted automatically. You must remove them manually or via the API
            </FaqBox>

            <FaqBox title="11. How can I contact support ?">
                For any other inquiries or issues, please contact us via our <Link to="/contact">Contact</Link> page
            </FaqBox>
        </div>
    )
}

export default Faq;