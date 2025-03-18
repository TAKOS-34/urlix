import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InformationMessage from '../InformationMessage';
import '../../styles/Account/ManageApi.css';

function ManageApi() {
    const [hasUserApiKey, setHasUserApiKey] = useState(false);
    const [apiKeyInfos, setApiKeysInfos] = useState({});
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/infos`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    if (res.data) {
                        setHasUserApiKey(true);
                        setApiKeysInfos(res.data);
                    } else {
                        setHasUserApiKey(false);
                    }
                    document.title = `URLIX | Manage API`;
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleGenerateApiKey = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                setInformationMessage({ text: res.message, color: res.status ? 'green' : 'red' });
                if (res.status) {
                    setTimeout(() => { window.location.href = '/account/manage-api'; }, 2000);
                }
                setTimeout(() => { setInformationMessage({ text: '', color: '' }) }, 5000);
            })
            .catch(err => console.error(err));
    }

    return (
        <div className="container-manage-api">

            {hasUserApiKey ? (
                <div className="container-api-informations">

                    <div className="api-informations-title">Your API key</div>
                    <hr />
                    <div className="api-informations-list">
                        <ul>
                            <li><span>First chars of API key : </span>{apiKeyInfos.firstChars}...</li>
                            <li><span>Creation date : </span>{apiKeyInfos.creationDate && apiKeyInfos.creationDate.replaceAll('-', '/').replace('T', ' at ').slice(0, 19)}</li>
                            <li><span>Number of uses <a title="Number of times you've created, updated or deleted an URL with your API key" style={{ fontSize: '0.7em', cursor: 'pointer', verticalAlign: 'top' }}>(?)</a> : </span>{apiKeyInfos.numberOfUses}</li>
                            <li><span>Last time used : </span>{apiKeyInfos.lastTimeUsed ? (apiKeyInfos.lastTimeUsed.replaceAll('-', '/').replace('T', ' at ').slice(0, 19)) : ('Never')}</li>
                        </ul>
                    </div>
                    <hr />
                    <div className="api-informations-contact"><Link to="/contact">If you lost your API key, please contact us</Link></div>

                </div>
            ) : (
                <div className="container-generate-api">

                    <div className="generate-api-title">You don't currently have an API key</div>
                    <div className="generate-api-descriptor">
                        To generate one, click on the button below. You'll receive your API key by email.
                        <span> Don't forget to save your key somewhere secure, once you delete the email, we won't be able to resend it to you. You'll have to contact us to generate a new one. </span>
                        Please consult <span><Link to="/api">Api</Link></span> documentation for more information.
                    </div>
                    {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}
                    <button className="generate-api-btn" onClick={handleGenerateApiKey}>Generate API key</button>

                </div>
            )}

        </div>
    );
}

export default ManageApi;