import React, { useState } from 'react';

// This reference is for Vite environments to provide type definitions for env variables
/// <reference types="vite/client" />

import { SetupGuide } from '../components/SetupGuide';
import { CheckoutDemo } from '../components/CheckoutDemo';
import { SubscriptionDemo } from '../components/SubscriptionDemo';
import { InvoicesDemo } from '../components/InvoicesDemo';
import '../styles/Demo.css'; // Import the new stylesheet

const demoSections = [
    { key: 'setup', label: 'Setup Guide', component: <SetupGuide /> },
    { key: 'checkout', label: 'Checkout Demo', component: <CheckoutDemo /> },
    { key: 'subscription', label: 'Subscription Demo', component: <SubscriptionDemo /> },
    { key: 'invoices', label: 'Invoices Demo', component: <InvoicesDemo /> },
];

export const Demo: React.FC = () => {
    const [selected, setSelected] = useState(demoSections[0].key);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSelectItem = (key: string) => {
        setSelected(key);
        if (window.innerWidth <= 768) {
            setMenuOpen(false);
        }
    };

    return (
        <div className={`demo-root ${menuOpen ? 'menu-open' : ''}`}>
            <button 
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                ☰
            </button>
            <aside className="demo-sidebar">
                <div className="demo-sidebar-header">
                    <span role="img" aria-label="credit card" className="demo-sidebar-icon">💳</span>
                    React Stripe Toolkit
                </div>
                <nav className="demo-sidebar-nav">
                    {demoSections.map(section => (
                        <div
                            key={section.key}
                            onClick={() => handleSelectItem(section.key)}
                            className={`demo-nav-item ${selected === section.key ? 'selected' : ''}`}
                        >
                            {section.label}
                        </div>
                    ))}
                </nav>
                <div className="demo-sidebar-footer">
                    &copy; {new Date().getFullYear()} React Stripe Toolkit
                </div>
            </aside>
            <main className="demo-main">
                <div className="demo-main-content">
                    {demoSections.find(s => s.key === selected)?.component}
                </div>
            </main>
        </div>
    );
};
