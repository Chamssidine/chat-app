import React from 'react';

import { Radar } from 'react-chartjs-2';

export default function SoftSkills({ data }) {
    const labels = Object.keys(data);
    const values = Object.values(data);

    return (
        <section className="section">
            <h2>Soft Skills & Personality Fit</h2>
            <Radar
                data={{
                    labels,
                    datasets: [{
                        label: 'Score',
                        data: values,
                        backgroundColor: 'rgba(92,107,192,0.3)',
                        borderColor: '#5c6bc0'
                    }]
                }}
                options={{
                    responsive: true,
                    scales: {
                        r: {
                            min: 0,
                            max: 5,
                            ticks: { stepSize: 1 }
                        }
                    }
                }}
            />
        </section>
    );
}
