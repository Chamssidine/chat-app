// src/components/dashboard/FormatCheck.jsx
import React from 'react';
import './FormatCheck.css';

export default function FormatCheck({ data }) {
    return (
        <section className="section">
            <h2>Qualité de format & lisibilité</h2>
            <div className="score-circle">{data.score}%</div>
            <ul className="issue-list">
                {data.issues.map((issue, idx) => (
                    <li key={idx}>⚠️ {issue}</li>
                ))}
            </ul>
        </section>
    );
}
