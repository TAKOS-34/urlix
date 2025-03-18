import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import '../../../styles/Account/ManageUrl/Qrcode.css';

function Qrcode() {
    const navigate = useNavigate();
    const { urlId } = useParams();
    const [urlInfos, setUrlInfos] = useState('');

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
                    document.title = `URLIX | Qr Code Generator`;
                } else {
                    navigate('/');
                }
            })
            .catch(err => console.error(err));
    }, []);

    const downloadQR = () => {
        const svg = document.querySelector("svg");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const urlBlob = URL.createObjectURL(svgBlob);
        img.onload = () => {
            canvas.width = svg.clientWidth;
            canvas.height = svg.clientHeight;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(urlBlob);
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "qrcode.png";
            link.click();
        }
        img.src = urlBlob;
    };

    return (
        <div className="container-qrcode">
            {!urlInfos ? (
                <div></div>
            ) : (
                <>
                    <div className="container-navigator">
                        <div className="link-list">
                            <Link to="/account/manage-url">Manage URL</Link> {`> QR Code Generator`}
                        </div>
                        <div className="switch-list">
                            <Link to={`/account/manage-url/infos-stats/${urlInfos.id}`}>Infos & Stats</Link> |
                            <Link to={`/account/manage-url/update-url/${urlInfos.id}`}> Update</Link> |
                            <Link to={`/account/manage-url/delete-url/${urlInfos.id}`}> Delete</Link>
                        </div>
                    </div>
                    <div className="separator"></div>
                    <div className="container-descriptor">
                        <div className="qrcode-descriptor">
                            QR Code for <a href={urlInfos.url} target="_blank">{urlInfos.url.replace(/^https?:\/\//, '')}</a>
                        </div>
                        <div className="qrcode">
                            <QRCodeSVG
                                value={urlInfos.url}
                                style={{ width: "100%", height: "100%" }}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="H"
                            />
                        </div>
                        <button onClick={downloadQR} className="qcode-dl-btn">Download in PNG</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Qrcode;