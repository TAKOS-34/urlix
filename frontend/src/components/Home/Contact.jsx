import React, { useState } from 'react';
import InformationMessage from '../InformationMessage';
import '../../styles/Home/Contact.css';
import '../../styles/LoginSignUp/AccountForm.css';
import emailIcon from '../../assets/images/email.png';
import subjectIcon from '../../assets/images/subject.png';

import { Helmet } from 'react-helmet-async';

function Contact() {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [wordCounter, setWordCounter] = useState(0);
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });

    const handleContactSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, subject, message })
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

    return (
        <div className="container-contact-form">
            <Helmet>
                <title>URLIX | Contact</title>
                <meta name="description" content="Contact URLIX - Have questions or feedback? Reach out to us through our contact form." />
            </Helmet>
            <form onSubmit={handleContactSubmit}>
            <div className="account-contact contact-form">
                <div className="account-contact-title">Contact</div>

                    <div className="account-contact-input">
                        <input
                            type="email"
                            minLength="4"
                            maxLength="320"
                            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <img src={emailIcon} alt="Email Icon" className="account-contact-input-icon" />
                    </div>

                    <div className="account-contact-input">
                        <input
                            type="text"
                            minLength="4"
                            maxLength="150"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                        <img src={subjectIcon} alt="Subject Icon" className="account-contact-input-icon" />
                    </div>

                    <div className="account-contact-input">
                        <textarea
                            placeholder="Your message"
                            minLength="4"
                            maxLength="3000"
                            value={message}
                            onChange={(e) => { setMessage(e.target.value); setWordCounter(e.target.value.length); }}
                            required
                        />
                        <div className="word-counter">{wordCounter}/3000</div>
                    </div>

                    {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}

                    <button type="submit">Send</button>

                </div>
            </form>
        </div>
    );
}

export default Contact;