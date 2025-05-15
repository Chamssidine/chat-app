// src/components/dashboard/KeywordDensity.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function KeywordDensity({ data }) {
    const chartData = {
        labels: data.map(d => d.keyword),
        datasets: [
            {
                label: 'Densité',
                data: data.map(d => d.density),
                backgroundColor: '#5c6bc0'
            }
        ]
    };
    const options = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: { beginAtZero: true }
        }
    };

    return (
        <section className="section">
            <h2>Densité des mots-clés</h2>
            <Bar data={chartData} options={options} />
        </section>
    );
}
