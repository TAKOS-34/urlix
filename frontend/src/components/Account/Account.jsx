import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from "../AuthProvider";
import '../../styles/Account/Account.css';
import ShortURL from './ShortURL';
import ManageURL from './ManageURL';
import Qrcode from './ManageURL/Qrcode';
import InfosStats from './ManageURL/InfosStats';
import UpdateUrl from './ManageURL/UpdateUrl';
import DeleteUrl from './ManageURL/DeleteUrl';
import ManageAPI from './ManageAPI';
import Information from "./Information";
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import newIcon from '../../assets/images/new-black.png';
import newIconFill from '../../assets/images/new-black-fill.png';
import listIcon from '../../assets/images/list-black.png';
import listIconFill from '../../assets/images/list-black-fill.png';
import apiIcon from '../../assets/images/api-black.png';
import apiIconFill from '../../assets/images/api-black-fill.png';
import informationIcon from '../../assets/images/information-black.png';
import informationIconFill from '../../assets/images/information-black-fill.png';
import emailIcon from '../../assets/images/email.png';
import emailIconFill from '../../assets/images/email-fill.png';
import passwordIcon from '../../assets/images/password.png';
import passwordIconFill from '../../assets/images/password-fill.png';
import deleteIcon from '../../assets/images/cross-black.png';
import deleteIconFill from '../../assets/images/cross-black-fill.png';

function Account() {
    const { isLoggedIn, loading } = useAuth();
    const navigate = useNavigate();
    const selectedMenu = useParams().menu || '';
    const subMenu = useParams().subMenu || '';
    const menuList = ['short-url', 'manage-url', 'manage-api', 'information', 'change-email', 'change-password', 'delete-my-account'];
    const subMenuList = ['qrcode', 'infos-stats', 'update-url', 'delete-url'];

    useEffect(() => {
        if (!loading) {
            if (!isLoggedIn) {
                navigate('/login');
            } else if (!menuList.includes(selectedMenu)) {
                navigate('/account/information');
            } else if (selectedMenu === 'manage-url' && subMenu && !subMenuList.includes(subMenu)) {
                navigate('/account/information');
            } else {
                menuList.forEach(menu => {
                    document.querySelector(`.short-url-li-${menu}`).classList.remove('selected-menu');
                });
                document.querySelector(`.short-url-li-${selectedMenu}`).classList.add('selected-menu');
            }
        }
    }, [isLoggedIn, selectedMenu]);

    return (
        <div className="container-account">

            <div className="container-selection-menu">

                <ul>
                    <li>
                        <Link to="/account/short-url" className="short-url-li">
                            <img src={selectedMenu === 'short-url' ? newIconFill : newIcon} alt="Short URL Icon" />
                            <span className="short-url-li-short-url">Short URL</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/account/manage-url" className="manage-url-li">
                            <img src={selectedMenu === 'manage-url' ? listIconFill : listIcon} alt="Manage URL Icon" />
                            <span className="short-url-li-manage-url">Manage URL</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/account/manage-api" className="manage-api-li">
                            <img src={selectedMenu === 'manage-api' ? apiIconFill : apiIcon} alt="Manage API Icon" />
                            <span className="short-url-li-manage-api">Manage API</span>
                        </Link>
                    </li>

                    <hr />

                    <li>
                        <Link to="/account/information" className="informations-li">
                            <img src={selectedMenu === 'information' ? informationIconFill : informationIcon} alt="Information Icon" />
                            <span className="short-url-li-information">Information</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/account/change-email" className="change-email-li">
                            <img src={selectedMenu === 'change-email' ? emailIconFill : emailIcon} alt="Email Icon" />
                            <span className="short-url-li-change-email">Change Email</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/account/change-password" className="change-password-li">
                            <img src={selectedMenu === 'change-password' ? passwordIconFill : passwordIcon} alt="Password Icon" />
                            <span className="short-url-li-change-password">Change Password</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/account/delete-my-account" className="delete-my-account-li">
                            <img src={selectedMenu === 'delete-my-account' ? deleteIconFill : deleteIcon} alt="Delete Account Icon" />
                            <span className="short-url-li-delete-my-account">Delete my account</span>
                        </Link>
                    </li>

                </ul>

            </div>

            <div className="container-menu">

                {selectedMenu === 'short-url' ? (
                    <ShortURL />
                ) : (selectedMenu === 'manage-url' && !subMenu) ? (
                    <ManageURL />
                    ) : (selectedMenu === 'manage-url' && subMenu === 'qrcode') ? (
                        <Qrcode />
                    ) : (selectedMenu === 'manage-url' && subMenu === 'infos-stats') ? (
                        <InfosStats />
                    ) : (selectedMenu === 'manage-url' && subMenu === 'update-url') ? (
                        <UpdateUrl />
                    ) : (selectedMenu === 'manage-url' && subMenu === 'delete-url') ? (
                        <DeleteUrl />
                ) : selectedMenu === 'manage-api' ? (
                    <ManageAPI />
                ) : selectedMenu === 'information' ? (
                    <Information />
                ) : selectedMenu === 'change-email' ? (
                    <ChangeEmail />
                ) : selectedMenu === 'change-password' ? (
                    <ChangePassword />
                ) : selectedMenu === 'delete-my-account' ? (
                    <DeleteAccount />
                ) : (
                    <div>Error</div>
                )}

            </div>

        </div>
    );
}

export default Account;