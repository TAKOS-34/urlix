import React, { useState } from 'react';
import InformationMessage from '../InformationMessage';
import '../../styles/Account/ShortURL.css';
import showIcon from '../../assets/images/show.png';
import hideIcon from '../../assets/images/hide.png';

function ShortURL() {
    const [redirectUrl, setRedirectUrl] = useState('');
    const [personalizedUrl, setPersonalizedUrl] = useState('');
    const [urlName, setUrlName] = useState('');
    const [personalizedUrlBorderColor, setPersonalizedUrlBorderColor] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [expirationDate, setExpirationDate] = useState('');
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });
    document.title = `URLIX | Short URL`;

    const handleShortUrl = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND_URL}/url/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ redirectUrl, personalizedUrl, urlName, password, expirationDate })
        })
            .then(res => res.json())
            .then(res => {
                setInformationMessage({ text: res.message, color: res.status ? 'green' : 'red' });
                if (res.status) {
                    setTimeout(() => { window.location.href = '/account/manage-url'; }, 500);
                }
                setTimeout(() => { setInformationMessage({ text: '', color: '' }) }, 5000);
            })
            .catch(err => console.error(err));
    }

    const verifyPersonalizedUrl = (e) => {
        if (e.length > 3) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/url/verifyPersonalizedUrl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ personalizeUrl: e })
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status) {
                        setPersonalizedUrlBorderColor(res.available ? 'green' : 'red');
                    }
                })
                .catch(err => {
                    console.error(err);
                    setPersonalizedUrlBorderColor('red');
                });
        } else {
            setPersonalizedUrlBorderColor('');
        }
    }

    return (
        <div className="container-short-url">
            <div className="short-url-title">Short URL</div>

            <form onSubmit={handleShortUrl} className="short-url-form">

                <div className="short-url-input">
                    <label htmlFor="url"><span style={{ fontWeight: '700' }}>URL to Short</span><span style={{ color: 'red' }}> *</span></label>
                    <input
                        type="text"
                        placeholder="https://example.com"
                        value={redirectUrl}
                        id="url"
                        onChange={(e) => setRedirectUrl(e.target.value.trim())}
                        minLength="8"
                        maxLength="2048"
                        pattern="https?:\/\/([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(\/\S*)?"
                        required
                    />
                </div>

                <div className="short-url-input">
                    <label htmlFor="personalizedUrl" style={{ fontStyle: 'italic' }}>Personalized URL (letters, digits, -_)</label>
                    <input
                        type="text"
                        placeholder="If you want a personalized URL"
                        value={personalizedUrl}
                        id="personalizedUrl"
                        onChange={(e) => {setPersonalizedUrl(e.target.value); verifyPersonalizedUrl(e.target.value)}}
                        minLength="4"
                        maxLength="150"
                        pattern="[a-zA-Z0-9\-_]+"
                        style={{ borderColor: personalizedUrlBorderColor }}
                    />
                </div>

                <div className="short-url-input">
                    <label htmlFor="name" style={{ fontStyle: 'italic' }}>Name</label>
                    <input
                        type="text"
                        placeholder="If you want to name your url"
                        value={urlName}
                        id="name"
                        onChange={(e) => setUrlName(e.target.value)}
                        minLength="4"
                        maxLength="150"
                        pattern="[a-zA-Z0-9\-_!?@#$%^&*()_+{}:;, ]"
                    />
                </div>

                <div className="short-url-input" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <label htmlFor="password" style={{ fontStyle: 'italic' }}>Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="To make your redirection private"
                        value={password}
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        minLength="4"
                        maxLength="256"
                        style={{ paddingRight: '40px' }}
                    />
                    <img
                        src={showPassword ? hideIcon : showIcon}
                        alt="Password Icon"
                        title={showPassword ? 'Hide password' : 'Show password'}
                        className="short-url-form-input-icon-password"
                        onClick={() => { setShowPassword(!showPassword); }}
                    />
                </div>

                <div className="short-url-input">
                    <label htmlFor="date" style={{ fontStyle: 'italic' }}>Expiration Date</label>
                    <input
                        type="datetime-local"
                        placeholder="Date"
                        value={expirationDate}
                        id="date"
                        onChange={(e) => setExpirationDate(e.target.value)}
                    />
                </div>

                {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}

                <button type="submit" className="form-btn">Short Url</button>

            </form>
        </div>
    )
}

export default ShortURL;