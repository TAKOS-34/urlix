import React from 'react';
import '../../styles/Home/Confidentiality.css';

function Confidentiality() {
    document.title = `URLIX | Privacy Policy`;

    return (
        <div className="container-confidentiality">
            <div className="confidentiality-title">Privacy Policy</div>
    
            <div className="confidentiality-intro">
                This privacy policy describes how I collect, use, store, and protect your personal data on this URL shortening website and its API. This is a personal project by a student for learning purposes and is not run by a commercial company.
            </div>
    
            <div className="confidentiality-nav">
            <div className="confidentiality-nav-title">Table of Contents</div>
                <ul className="confidentialitu-nav-list">
                    <li><a href="#intro">1. Introduction and General Framework</a></li>
                    <li><a href="#data">2. Data Collected</a></li>
                    <li><a href="#purposes">3. Purposes of Data Collection and Use</a></li>
                    <li><a href="#legal">4. Legal Basis for Processing</a></li>
                    <li><a href="#retention">5. Data Retention and Deletion</a></li>
                    <li><a href="#sharing">6. Data Sharing and Data Location</a></li>
                    <li><a href="#cookies">7. Cookie Use</a></li>
                    <li><a href="#security">8. Data Security</a></li>
                    <li><a href="#rights">9. Users' Rights</a></li>
                    <li><a href="#api">10. API Specifics</a></li>
                    <li><a href="#changes">11. Changes to the Privacy Policy</a></li>
                    <li><a href="#contact">12. Contact</a></li>
                </ul>
            </div>

            <div id="intro" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    1. Introduction and General Framework
                </div>
                <div className="confidentiality-section-content">
                    Purpose of the site: This site allows you to shorten URLs and provides various functionalities as well as an API to manage your links.<br />
                    Project nature: This is a personal project carried out in free time for learning purposes.
                </div>
            </div>

            <div id="data" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    2. Data Collected
                </div>
                <div className="confidentiality-section-content">
                    <span>Account registration and use:</span><br />
                    - Email address: Provided during registration and confirmed via an email token.<br />
                    - Authentication: A session cookie is used to verify the user’s identity for each action (creation, reading, modification, and deletion of a shortened link).<br /><br />
                    <span>Usage of shortened URLs and API:</span><br />
                    - Technical data: IP address (to infer an approximate location), browser type and version, and date/time of use.<br />
                    - Activity logs: Each action (creation, reading, modification, and deletion of a link) is recorded with the user's email address.<br /><br />
                    <span>Contact:</span><br />
                    For any inquiries through the contact form (accessible at <a href="/contact">/contact</a>), only the email address is requested without further verification.
                </div>
            </div>

            <div id="purposes" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    3. Purposes of Data Collection and Use
                </div>
                <div className="confidentiality-section-content">
                    - Statistics and service improvement: To analyze service usage for optimizing performance and usability.<br />
                    - Traceability and security: To monitor actions and detect or prevent abnormal or malicious behavior.<br />
                    - Authentication: To ensure secure access to accounts and the API by verifying the user’s identity.<br />
                    - Communication: To inform users in case of important changes (e.g., security breach or policy modifications).<br /><br />
                    No data is sold or shared with third parties for advertising or commercial purposes.
                </div>
            </div>

            <div id="legal" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    4. Legal Basis for Processing
                </div>
                <div className="confidentiality-section-content">
                    - Your consent: Provided when creating your account and using the services.<br />
                    - Necessity to provide the service: To manage shortened links and offer API access.<br />
                    - Legitimate interest: To ensure the security and traceability of actions on the service.
                </div>
            </div>

            <div id="retention" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    5. Data Retention and Deletion
                </div>
                <div className="confidentiality-section-content">
                    - Retention duration: Data is stored indefinitely as long as the account or associated URLs exist.<br />
                    - Deletion:<br />
                    -- Deleting a link or an account results in the immediate and permanent deletion of the corresponding data.<br />
                    -- Deleting the account does not automatically delete associated URLs; each URL must be deleted manually or via the API.
                </div>
            </div>

            <div id="sharing" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    6. Data Sharing and Data Location
                </div>
                <div className="confidentiality-section-content">
                    - Data sharing: No personal data is shared with third parties.<br />
                    - Data location: Data is stored exclusively in France.
                </div>
            </div>

            <div id="cookies" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    7. Cookie Use
                </div>
                <div className="confidentiality-section-content">
                    A single session cookie is used. This token is essential for:<br />
                    - Managing the account (performing creation, reading, modification, and deletion of a link and accessing the API).<br />
                    - Verifying the user’s identity for every action.<br /><br />
                    This cookie does not contain any sensitive information other than the user’s email address.
                </div>
            </div>

            <div id="security" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    8. Data Security
                </div>
                <div className="confidentiality-section-content">
                    <span>Database protection:</span><br />
                    - Secure storage of sensitive data.<br />
                    - Encryption of passwords and API keys.<br />
                    - Protection against SQL injections.<br />
                    - Restricted access to the production database (only accessible from the server's IP address).<br /><br />
                    <span>Protection against attacks:</span><br />
                    - Mechanisms to guard against DDoS attacks to prevent brute force attempts.<br />
                    - Activity logs to detect any intrusion.<br /><br />
                    <span>Procedure in case of a breach:</span><br />
                    In the event of a security issue, an email will be sent to users, all passwords will be changed, and the encryption key for tokens will be updated.
                </div>
            </div>

            <div id="rights" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    9. Users' Rights
                </div>
                <div className="confidentiality-section-content">
                    Users remain in control of their data and can:<br />
                    - Access their personal information.<br />
                    - Update or modify their data.<br />
                    - Delete all or part of their data.
                </div>
            </div>

            <div id="api" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    10. API Specifics
                </div>
                <div className="confidentiality-section-content">
                    - Authentication: The API uses a token-based authentication system, with the token sent in HTTP headers.<br />
                    - Obtaining the API key: Users can generate an API key from their account dashboard. This key is sent by email and is uniquely associated with the user.<br />
                    - Management and responsibilities: The API key grants full access to all operations (creation, reading, modification, and deletion) of the URLs associated with the account. In case of loss or compromise of the key, the administrator must be contacted.<br />
                    - Data collected via the API: No additional data is collected via the API apart from what is necessary for authentication and activity tracking.
                </div>
            </div>

            <div id="changes" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    11. Changes to the Privacy Policy
                </div>
                <div className="confidentiality-section-content">
                    Any changes to this policy will be communicated to users via email and will take effect as soon as the email is sent.
                </div>
            </div>

            <div id="contact" className="confidentiality-section">
                <div className="confidentiality-section-title">
                    12. Contact
                </div>
                <div className="confidentiality-section-content">
                    For any questions or requests related to this privacy policy:<br />
                    - Use the contact form available at <a href="/contact">/contact</a>.<br />
                    - Responses will be sent to the email address provided in the form.<br /><br />
                    By using this service, you agree to the terms described in this privacy policy. It is recommended that you regularly review this page to stay informed of any changes.
                </div>
            </div>
        </div>
    );
}

export default Confidentiality;