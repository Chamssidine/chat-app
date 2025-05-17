// src/components/dashboard/TrainingSuggestions.jsx
import React from 'react';
import './TrainingSuggestions.css';

export default function TrainingSuggestions({ data }) {
    return (
        <section className="section">
            <h2>Actualités positives</h2>
            <div className="card-list">
                {data.map((item, i) => (
                    <div className="card" key={i}>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-btn"
                        >
                            Lire l'article
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
}
