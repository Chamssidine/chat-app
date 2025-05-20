// src/components/dashboard/SoftSkills.jsx
import React from 'react';
import { Radar } from 'react-chartjs-2';
import './SoftSkills.css';

export default function SoftSkills({ data }) {
    const labels = Object.keys(data);
    const values = Object.values(data);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Évaluation',
                data: values,
                backgroundColor: 'rgba(92, 107, 192, 0.3)',
                borderColor: '#5c6bc0',
                pointBackgroundColor: '#5c6bc0',
                pointBorderColor: '#fff'
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            r: {
                min: 0,
                max: 10,
                ticks: {
                    stepSize: 2,
                    showLabelBackdrop: false,
                    color: '#7f8c8d',
                    backdropColor: 'transparent'
                },
                grid: {
                    color: '#dcdde1'
                },
                pointLabels: {
                    font: {
                        size: 14
                    },
                    color: '#34495e'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return (
        <section className="section soft-skills-section">
            <h2>Soft Skills & Affinités personnelles</h2>

            <div className="chart-container">
                <Radar data={chartData} options={options} />
            </div>

            <ul className="soft-skills-list">
                {labels.map((label, idx) => (
                    <li key={idx}>
                        <strong>{label} :</strong> {data[label]}/10
                    </li>
                ))}
            </ul>
        </section>
    );
}
