// src/components/dashboard/SemanticAnalysis.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function SemanticAnalysis({ data }) {
    const chartData = {
        labels: ['Mots couverts', 'Mots manquants'],
        datasets: [{
            data: [data.matchedKeywords, data.totalKeywords - data.matchedKeywords],
            backgroundColor: ['#5c6bc0','#e0e0e0']
        }]
    };

    return (
        <section className="section">
            <h2>Analyse sémantique & mots-clés</h2>
            <Bar data={chartData} options={{ responsive:true }} />
            <div className="tag-cloud">
                {data.keywords.map((k, i) => <span className="tag" key={i}>{k}</span>)}
            </div>
        </section>
    );
}
