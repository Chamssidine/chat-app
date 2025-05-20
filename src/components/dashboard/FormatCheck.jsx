// src/components/dashboard/FormatCheck.jsx
import React, { useState } from 'react';
import './FormatCheck.css';

export default function FormatCheck({ data, theme = 'light' }) {
    const [showAll, setShowAll] = useState(false);

    // Préparation des issues
    const issues = data.issues.map(raw =>
        typeof raw === 'string'
            ? { text: raw, severity: 'warning', icon: '⚠️' }
            : { text: raw.text, severity: raw.severity || 'warning', icon: raw.icon }
    );
    const issuesToShow = showAll ? issues : issues.slice(0, 3);

    return (
        <section className={`section format-check ${theme}`}>
            <h2>Qualité de format & lisibilité</h2>
            <p className="subtitle">
                Le score reflète la structure, la police et la mise en page de votre CV.
            </p>

            <div className="radial-container">
                <svg className="radial" viewBox="0 0 36 36">
                    <path
                        className="radial-bg"
                        d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className="radial-progress"
                        strokeDasharray={`${data.score}, 100`}
                        d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
                <div className="radial-text">
                    <span>{data.score}%</span>
                </div>
            </div>

            {issues.length === 0 ? (
                <p className="no-issues">✅ Aucun problème détecté !</p>
            ) : (
                <>
                    <ul className="issue-list">
                        {issuesToShow.map((issue, idx) => (
                            <li key={idx} className={`issue-item severity-${issue.severity}`}>
                                <span className="issue-icon">{issue.icon}</span>
                                <span className="issue-text">{issue.text}</span>
                            </li>
                        ))}
                    </ul>
                    {issues.length > 3 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="show-all-btn"
                        >
                            {showAll ? 'Voir moins' : 'Voir tout'}
                        </button>
                    )}
                </>
            )}
        </section>
    );
}
