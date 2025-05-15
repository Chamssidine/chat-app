import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function Benchmark({ data }) {
    const pct = data.salaryPercentile;
    return (
        <section className="section">
            <h2>Benchmark salarial & rôle</h2>
            <Doughnut
                data={{
                    labels: ['Vous', 'Restant'],
                    datasets: [{
                        data: [pct, 100 - pct],
                        backgroundColor: ['#5c6bc0', '#e0e0e0']
                    }]
                }}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }}
            />
            <p>Top {100 - pct}% des profils similaires</p>
        </section>
    );
}
