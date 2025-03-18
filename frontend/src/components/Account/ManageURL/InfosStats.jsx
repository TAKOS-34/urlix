import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import Statistics from './Statistics';
import '../../../styles/Account/ManageUrl/InfosStats.css';

function InfosStats() {
    const navigate = useNavigate();
    const { urlId } = useParams();
    const [urlInfos, setUrlInfos] = useState('');
    const [urlStatistics, setUrlStatistics] = useState('');
    const [redirectionToday, setRedirectionToday] = useState(0);
    const [redirectionMonth, setRedirectionMonth] = useState(0);
    const [totalRedirection, setTotalRedirection] = useState(0);

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
                    document.title = `URLIX | Informations & Statistics`;
                } else {
                    navigate('/');
                }
            })
            .catch(err => console.error(err));
        fetch(`${process.env.REACT_APP_BACKEND_URL}/url/get/statistics/statisticsLastMonth/${urlId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    setUrlStatistics(res.data);
                    setRedirectionToday(getTodayRedirections(res.data));
                    setRedirectionMonth(getMonthRedirections(res.data));
                } else {
                    navigate('/');
                }
            });
        fetch(`${process.env.REACT_APP_BACKEND_URL}/url/get/statistics/totalRedirections/${urlId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    setTotalRedirection(res.data);
                } else {
                    navigate('/');
                }
            });
    }, []);

    function getTodayRedirections(data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return data.reduce((sum, entry) => {
            const entryDate = new Date(entry.day);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime() ? sum + entry.redirectionCount : sum;
        }, 0);
    }

    function getMonthRedirections(data) {
        return data.reduce((sum, entry) => sum + entry.redirectionCount, 0);
    }

    return (
        <div className="container-infos-stats">
        {!urlInfos || !urlStatistics || (!totalRedirection && totalRedirection !== 0) ? (
            <div></div>
        ) : (
            <>
                <div className="container-navigator">
                    <div className="link-list">
                        <Link to="/account/manage-url">Manage URL</Link> {`> Informations and Statistics`}
                    </div>
                    <div className="switch-list">
                        <Link to={`/account/manage-url/qrcode/${urlInfos.id}`}>Qr Code</Link> |
                        <Link to={`/account/manage-url/update-url/${urlInfos.id}`}> Update</Link> |
                        <Link to={`/account/manage-url/delete-url/${urlInfos.id}`}> Delete</Link>
                    </div>
                </div>
                <div className="separator"></div>
                <div className="container-infos-list">
                    <ul>
                        <li><span>URL : </span>{urlInfos.url}</li>
                        <li><span>Redirection URL : </span>{urlInfos.redirectUrl}</li>
                        {urlInfos.urlName && (<li><span>Name : </span>{urlInfos.urlName}</li>)}
                        <li><span>Date of creation : </span>{urlInfos.creationDate.replaceAll('-', '/').replace('T', ' at ').slice(0, 19)}</li>
                        {urlInfos.expirationDate && (<li><span>Date of expiration : </span>{urlInfos.expirationDate.replaceAll('-', '/').replace('T', ' at ').slice(0, 19)}</li>)}
                        <li><span>Number of redirections : </span>{totalRedirection}</li>
                        <li><span>Number of redirections this month: </span>{redirectionMonth}</li>
                        <li><span>Number of redirections today : </span>{redirectionToday}</li>
                        {urlStatistics.length !== 0 && (
                            <li className="container-details-stats-li"><span>Details of redirections this month : </span><div className="container-details-stats"><Statistics data={urlStatistics} /></div></li>
                        )}
                    </ul>
                </div>
            </>
        )}
    </div>
    );
}

export default InfosStats;