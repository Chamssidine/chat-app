// src/components/dashboard/SemanticAnalysis.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import './SemanticAnalysis.css';

export default function SemanticAnalysis({ data }) {
    const { matchedKeywords, totalKeywords, keywordsDetail } = data;
    const missingCount = totalKeywords - matchedKeywords;
    const coveragePct = totalKeywords
        ? Math.round((matchedKeywords / totalKeywords) * 100)
        : 0;

    const foundKeywords = keywordsDetail
        .filter(k => k.matched)
        .sort((a, b) => b.frequency - a.frequency);
    const missingKeywords = keywordsDetail
        .filter(k => !k.matched)
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 10);

    const chartData = {
        labels: ['Couverts', 'Manquants'],
        datasets: [{
            label: 'Couverture',
            data: [coveragePct, 100 - coveragePct],
            backgroundColor: ['#5c6bc0', '#dcdde1'] // fix couleur
        }]
    };

    const chartOptions = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => `${ctx.parsed.x}%`
                }
            }
        },
        scales: {
            x: {
                max: 100,
                ticks: { callback: v => `${v}%` },
                grid: { color: '#f0f0f0' }
            },
            y: {
                grid: { display: false },
                ticks: { font: { size: 14 } }
            }
        }
    };

    return (
        <section className="section semantic-analysis">
            <h2>Analyse sémantique & mots-clés</h2>
            <p className="subtitle">
                Couverture : <strong>{coveragePct}%</strong> des <strong>{totalKeywords}</strong> mots-clés de l’offre
            </p>

            <div className="chart-wrapper">
                <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="keywords-lists">
                <div className="keyword-group">
                    <h3>Mots-clés trouvés</h3>
                    <ul>
                        {foundKeywords.map((k, i) => (
                            <li key={i}>
                                <span className="dot matched" />
                                {k.keyword} ({k.frequency})
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="keyword-group">
                    <h3>Top mots-clés manquants</h3>
                    <ul>
                        {missingKeywords.map((k, i) => (
                            <li key={i}>
                                <span className="dot missing" />
                                {k.keyword}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="tag-cloud">
                {keywordsDetail.map((k, i) => (
                    <span
                        key={i}
                        className={`tag ${k.matched ? 'matched' : 'missing'}`}
                        style={{
                            fontSize: `${Math.min(0.9 + k.frequency * 0.1, 1.4)}rem`
                        }}
                    >
            {k.keyword}
          </span>
                ))}
            </div>
        </section>
    );
}
