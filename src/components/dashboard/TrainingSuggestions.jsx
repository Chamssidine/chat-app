// src/components/dashboard/TrainingSuggestions.jsx
import React from 'react';
import './TrainingSuggestions.css';

export default function TrainingSuggestions({ data }) {
    return (
        <section className="section">
            <h2>Suggestions de formation</h2>
            <div className="card-list">
                {data.map((course,i)=>(
                    <div className="card" key={i}>
                        <h4>{course}</h4>
                        <button className="link-btn">Voir</button>
                    </div>
                ))}
            </div>
        </section>
    );
}
