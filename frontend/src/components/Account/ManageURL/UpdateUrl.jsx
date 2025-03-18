import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import InformationMessage from '../../InformationMessage';
import '../../../styles/Account/ManageUrl/Update.css';
import showIcon from '../../../assets/images/show.png';
import hideIcon from '../../../assets/images/hide.png';

function UpdateUrl() {
    const navigate = useNavigate();
    const { urlId } = useParams();
    const [urlInfos, setUrlInfos] = useState('');
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });
    const [redirectUrl, setRedirectUrl] = useState('');
    const [personalizedUrl, setPersonalizedUrl] = useState('');
    const [personalizedUrlBorderColor, setPersonalizedUrlBorderColor] = useState('');
    const [urlName, setUrlName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [expirationDate, setExpirationDate] = useState('');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/url/get/verify/${urlId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    setUrlInfos(res.data);
                    document.title = `URLIX | Update URL`;
                } else {
                    navigate('/');
                }
            })
            .catch(err => console.error(err));
    }, []);

    const verifypersonalizedUrl = (e) => {
        if (e.length > 3) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/url/verifyPersonalizedUrl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ personalizedUrl: e })
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

    const handleUpdateUrl = (e) => {
        e.preventDefault()
        fetch(`${process.env.REACT_APP_BACKEND_URL}/url/update/${urlId}`, {
            method: 'PUT',
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

    return (
        <div className="container-update">
            {!urlInfos ? (
                <div></div>
            ) : (
                <>
                    <div className="container-navigator">
                        <div className="link-list">
                            <Link to="/account/manage-url">Manage URL</Link> {`> Update URL`}
                        </div>
                        <div className="switch-list">
                            <Link to={`/account/manage-url/qrcode/${urlInfos.id}`}>Qr Code</Link> |
                            <Link to={`/account/manage-url/infos-stats/${urlInfos.id}`}> Infos & Stats</Link> |
                            <Link to={`/account/manage-url/delete-url/${urlInfos.id}`}> Delete</Link>
                        </div>
                    </div>
                    <div className="separator"></div>
                    <div className="container-update-form">
                        <form onSubmit={handleUpdateUrl}>

                            <div className="update-url-input">
                                <label htmlFor="url">URL</label>
                                <input
                                    type="text"
                                    value={urlInfos.url}
                                    disabled
                                    style={{ backgroundColor: '#cecece' }}
                                />
                            </div>

                            <div className="update-url-input">
                                <label htmlFor="redirectUrl">URL to Short</label>
                                <input
                                    type="text"
                                    placeholder={urlInfos.redirectUrl}
                                    value={redirectUrl}
                                    id="redirectUrl"
                                    onChange={(e) => {setRedirectUrl(e.target.value)}}
                                    minLength="8"
                                    maxLength="2048"
                                    pattern="https?:\/\/([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(\/\S*)?"
                                />
                            </div>

                            <div className="update-url-input">
                                <label htmlFor="personalizedUrl" style={{ fontStyle: 'italic' }}>Personalized URL</label>
                                <input
                                    type="text"
                                    placeholder="Personalize your URL"
                                    value={personalizedUrl}
                                    id="personalizedUrl"
                                    onChange={(e) => {setPersonalizedUrl(e.target.value); verifypersonalizedUrl(e.target.value)}}
                                    minLength="4"
                                    maxLength="150"
                                    pattern="[a-zA-Z0-9\-_]+"
                                    style={{ borderColor: personalizedUrlBorderColor }}
                                />
                            </div>

                            <div className="update-url-input">
                                <label htmlFor="name" style={{ fontStyle: 'italic' }}>Name</label>
                                <input
                                    type="text"
                                    placeholder={urlInfos.urlName ? (`${urlInfos.urlName}`) : ('Name your url')}
                                    value={urlName}
                                    id="name"
                                    onChange={(e) => setUrlName(e.target.value)}
                                    minLength="4"
                                    maxLength="150"
                                    pattern="[a-zA-Z0-9\-_!?@#$%^&*()_+{}:;, ]"
                                />
                            </div>

                            <div className="update-url-input" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <label htmlFor="password" style={{ fontStyle: 'italic' }}>Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="To make your redirection private"
                                    value={password}
                                    id="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength="4"
                                    maxLength="256"
                                    style={{ paddingRight: '30px' }}
                                />
                                <img
                                    src={showPassword ? hideIcon : showIcon}
                                    alt="Password Icon"
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                    className="update-url-form-input-icon-password"
                                    onClick={() => {setShowPassword(!showPassword);}}
                                />
                            </div>

                            <div className="update-url-input">
                                <label htmlFor="date" style={{ fontStyle: 'italic' }}>Expiration Date {urlInfos.expirationDate && (` (Actually : ${urlInfos.expirationDate.replaceAll('-', '/').replace('T', ' at ').slice(0, 19)})`)}</label>
                                <input
                                    type="datetime-local"
                                    placeholder={urlInfos.expirationDate}
                                    value={expirationDate}
                                    id="date"
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                />
                            </div>

                            {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}

                            <button type="submit" className="form-btn">Update Url</button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}

export default UpdateUrl;