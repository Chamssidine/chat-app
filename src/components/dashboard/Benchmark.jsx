// src/components/dashboard/Benchmark.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import './Benchmark.css';

export default function Benchmark({ data }) {
    const { salaryPercentile, roleLevel } = data;
    const percentile = Math.min(Math.max(salaryPercentile, 0), 100);

    const chartData = {
        labels: ['Vous', 'Autres'],
        datasets: [
            {
                data: [percentile, 100 - percentile],
                backgroundColor: ['#5c6bc0', '#e0e0e0'],
                borderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.label}: ${ctx.raw}%`
                }
            }
        }
    };

    return (
        <section className="section benchmark-section">
            <h2>Benchmark salarial & rôle</h2>
            <div className="benchmark-container">
                <div className="doughnut-wrapper">
                    <Doughnut data={chartData} options={options} />
                    <div className="percent-text">
                        {percentile}<span>%</span>
                    </div>
                </div>
                <div className="benchmark-info">
                    <p>
                        Vous êtes positionné dans le <strong>top {percentile}%</strong> des candidats pour ce poste.
                    </p>
                    <p>
                        Niveau estimé : <strong className="role-label">{roleLevel}</strong>
                    </p>
                </div>
            </div>
        </section>
    );
}
