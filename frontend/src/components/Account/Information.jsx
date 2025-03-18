import React, { useState, useEffect } from 'react';
import '../../styles/Account/Information.css';

function Information() {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/getInfos`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    setUserData(res.data);
                    document.title = `URLIX | Account information`;
                }
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="informations-container">

            {
                (userData.length === 0) ? (
                    <div>Loading...</div>
                ) : (
                    <div className="container-information">
                        <div className="information-title">Information</div>
                        <ul className="information-list">
                            <li><span>Email : </span>{userData.email}</li>
                            <li><span>Total URLs created : </span>{userData.totalUrls}</li>
                            <li><span>Total of redirections : </span>{userData.totalRedirections}</li>
                            <li><span>Sign Up date : </span>{userData.creationDate && userData.creationDate.replaceAll('-', '/').replace('T', ' at ').slice(0, 19)}</li>
                        </ul>
                    </div>
                )
            }

        </div>
    );
}

export default Information;