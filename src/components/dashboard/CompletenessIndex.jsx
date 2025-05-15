// src/components/dashboard/CompletenessIndex.jsx
import React from 'react';

export default function CompletenessIndex({ data }) {
    return (
        <section className="section">
            <h2>Indice de complétude</h2>
            <progress value={data} max="100" style={{ width:'100%' }} />
            <p>{data}% complet</p>
        </section>
    );
}
