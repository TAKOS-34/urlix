import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../../styles/Account/ManageURL.css';
import arrowIcon from '../../assets/images/curved-arrow.png';
import copyIcon from '../../assets/images/copy.png';
import qrcodeIcon from '../../assets/images/qr-code.png';
import statsInfosIcon from '../../assets/images/stats-infos.png';
import editIcon from '../../assets/images/edit.png';
import deleteIcon from '../../assets/images/cross-black.png';
import searchIcon from '../../assets/images/search.png';

function ManageURL() {
    const [urlList, setUrlList] = useState([]);
    const [filteredUrlList, setFilteredUrlList] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectInput, setSelectInput] = useState('All');
    const [showExpireUrl, setShowExpireUrl] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/url/get/all`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    setUrlList(res.data);
                    setFilteredUrlList(res.data);
                    document.title = `URLIX | Manage URL`;
                }
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        let updatedList = [...urlList];
        if (searchInput.trim() !== '') {
            updatedList = updatedList.filter(item => {
                const lowerCaseSearch = searchInput.toLowerCase();
                return (
                    (item.urlName?.toLowerCase().includes(lowerCaseSearch)) ||
                    item.url.toLowerCase().includes(lowerCaseSearch) ||
                    item.redirectUrl.toLowerCase().includes(lowerCaseSearch) ||
                    item.creationDate.toLowerCase().includes(lowerCaseSearch) ||
                    item.expirationDate?.toLowerCase().includes(lowerCaseSearch)
                );
            });
        }
        if (!showExpireUrl) {
            const now = new Date();
            updatedList = updatedList.filter(item => {
                return !item.expirationDate || new Date(item.expirationDate) > now;
            });
        }
        switch (selectInput) {
            case 'Alphabetic +':
                updatedList.sort((a, b) => {
                    const nameA = a.urlName || '';
                    const nameB = b.urlName || '';
                    return nameA.localeCompare(nameB);
                });
                break;
            case 'Alphabetic -':
                updatedList.sort((a, b) => {
                    const nameA = a.urlName || '';
                    const nameB = b.urlName || '';
                    return nameB.localeCompare(nameA);
                });
                break;
            case 'Popularity +':
                updatedList.sort((a, b) => b.redirectionCount - a.redirectionCount);
                break;
            case 'Popularity -':
                updatedList.sort((a, b) => a.redirectionCount - b.redirectionCount);
                break;
            case 'Date +':
                updatedList.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
                break;
            case 'Date -':
                updatedList.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
                break;
            default:
                break;
        }
        setFilteredUrlList(updatedList);
    }, [urlList, searchInput, selectInput, showExpireUrl]);

    return (
        <div className="container-manage-url">

            <div className="container-search-filter">
                <div className="input-search">
                    <input
                        type="text"
                        value={searchInput}
                        maxLength="2048"
                        placeholder="Search by name, url or date"
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <img src={searchIcon} alt="Search Icon" />
                </div>
                <div className="input-filter">
                    <div className="input-order-by">
                        <span>Order by :</span>
                        <select value={selectInput} onChange={(e) => setSelectInput(e.target.value)}>
                            <option value="All">All</option>
                            <option value="Alphabetic +">Alphabetic +</option>
                            <option value="Alphabetic -">Alphabetic -</option>
                            <option value="Popularity +">Popularity +</option>
                            <option value="Popularity -">Popularity -</option>
                            <option value="Date +">Date +</option>
                            <option value="Date -">Date -</option>
                        </select>
                    </div>
                    <div className="input-show-expired">
                        <span>Show expired Url :</span>
                        <input type="checkbox" checked={showExpireUrl} onChange={() => setShowExpireUrl(!showExpireUrl)} />
                    </div>
                </div>
            </div>

            <div className="container-urls">
                {urlList.length > 0 ? (
                    <ul>
                        {filteredUrlList.map((data, index) => (
                            <li key={index} className="container-url">
                                <div className="url">
                                    <div className="area-redirection">
                                        <div className="upper">
                                            <a
                                                href={data.url}
                                                target="_blank"
                                                onMouseEnter={(e) => e.target.style.fontWeight = '900'}
                                                title={data.url.length > 27 ? (data.url) : ('')}
                                                onMouseLeave={(e) => e.target.style.fontWeight = '700'}
                                            >
                                                {data.url.length > 27 ? (data.url.replace(/^https?:\/\//, '').slice(0, 24) + '...') : (data.url.replace(/^https?:\/\//, ''))}
                                            </a>
                                            <img
                                                src={copyIcon}
                                                alt="Copy Incon"
                                                title="Copy URL"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(data.url);
                                                    window.alert('Url copy to clipboard');
                                                }}
                                            />
                                        </div>
                                        <div className="name">
                                            {data.urlName && (
                                                <a href={`${data.redirectUrl}`} target="_blank" title={data.urlName.length > 27 ? (data.urlName) : ('')}>Name : {data.urlName.length > 27 ? (data.urlName.slice(0,24) + '...') : (data.urlName)}</a>
                                            )}
                                        </div>
                                        <div className="lower">
                                            <img src={arrowIcon} alt="Arrow Icon" />
                                            <a
                                                href={data.redirectUrl}
                                                target="_blank"
                                                onMouseEnter={(e) => e.target.style.fontWeight = '700'}
                                                onMouseLeave={(e) => e.target.style.fontWeight = '400'}
                                                title={data.redirectUrl.length > 33 ? (data.redirectUrl) : ('')}
                                            >
                                                {data.redirectUrl.length > 33 ? (data.redirectUrl.replace(/^https?:\/\//, '').slice(0, 30) + '...') : (data.redirectUrl)}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="area-crud">
                                        <Link to={`/account/manage-url/qrcode/${data.id}`}>
                                            <img
                                                src={qrcodeIcon}
                                                alt="QR Code Icon"
                                                title="Generate a QR Code for your URL"
                                            />
                                        </Link>
                                        <Link to={`/account/manage-url/infos-stats/${data.id}`}>
                                            <img
                                                src={statsInfosIcon}
                                                alt="Statistics & Informations Icon"
                                                title="Views your url's statistics and informations"
                                            />
                                        </Link>
                                        <Link to={`/account/manage-url/update-url/${data.id}`}>
                                            <img
                                                src={editIcon}
                                                alt="Edit Icon"
                                                title="Edit your url"
                                            />
                                        </Link>
                                        <Link to={`/account/manage-url/delete-url/${data.id}`}>
                                            <img
                                                src={deleteIcon}
                                                alt="Delete Icon"
                                                title="Delete your url"
                                            />
                                        </Link>
                                    </div>

                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Link to="/account/short-url" className="create-link-button">
                        <button>Create your first url</button>
                    </Link>
                )}
            </div>

        </div>
    );
}

export default ManageURL;