import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import InformationMessage from '../../InformationMessage';
import '../../../styles/Account/ManageUrl/Delete.css';

function DeleteUrl() {
    const navigate = useNavigate();
    const { urlId } = useParams();
    const [urlInfos, setUrlInfos] = useState('');
    const [informationMessage, setInformationMessage] = useState({ text: '', color: '' });

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
                    document.title = `URLIX | Delete URL`;
                } else {
                    navigate('/');
                }
            })
            .catch(err => console.error(err));
    }, []);

    const deleteUrl = (url) => {
        if (url) {
            if (window.confirm('Delete this URL ? This action is irreversible !')) {
                fetch(`${process.env.REACT_APP_BACKEND_URL}/url/delete/${url}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
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
        }
    }

    return (
        <div className="container-delete">
            {!urlInfos ? (
                <div></div>
            ) : (
                <>
                    <div className="container-navigator">
                        <div className="link-list">
                            <Link to="/account/manage-url">Manage URL</Link> {`> Delete URL`}
                        </div>
                        <div className="switch-list">
                            <Link to={`/account/manage-url/qrcode/${urlInfos.id}`}>Qr Code</Link> |
                            <Link to={`/account/manage-url/infos-stats/${urlInfos.id}`}> Infos & Stats</Link> |
                            <Link to={`/account/manage-url/update-url/${urlInfos.id}`}> Update</Link>
                        </div>
                    </div>
                    <div className="separator"></div>
                    <div className="container-delete-form">
                        {informationMessage.text && <InformationMessage message={{ text: informationMessage.text, color: informationMessage.color }} />}
                        <div className="delete-descriptor">Are you sure you want to delete : <span>{urlInfos.url.replace(/^https?:\/\//, '')}</span> ?</div>
                        <div className="delete-btn">
                            <button onClick={() => {deleteUrl(urlInfos.id)}} className="yes-btn">Yes</button>
                            <button onClick={() => {navigate(`/account/manage-url/infos-stats/${urlInfos.id}`)}} className="no-btn">No</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default DeleteUrl;