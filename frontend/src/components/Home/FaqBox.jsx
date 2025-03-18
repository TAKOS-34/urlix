import React, { useState } from 'react';

const FAQBox = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleFAQ = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="faq-box" onClick={toggleFAQ}>
            <div className="faq-box-header">
                <div className="faq-box-title">
                    {title}
                </div>
                <div className="faq-box-status">
                    {isOpen ? '-' : '+'}
                </div>
            </div>

            {isOpen && (
                <div className="faq-box-content">
                    {children}
                </div>
            )}
        </div>
    );
};

export default FAQBox;
