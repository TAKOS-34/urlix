import React from 'react';
import '../styles/InformationMessage.css';

function InformationMessage(props) {
    return (
        <div style={{ color: props.message.color }} className="information-message">
            {props.message.text}
        </div>
    )
}

export default InformationMessage;