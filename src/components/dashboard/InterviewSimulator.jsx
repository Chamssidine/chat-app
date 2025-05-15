// src/components/dashboard/InterviewSimulator.jsx
import React, { useState } from 'react';

export default function InterviewSimulator({ data }) {
    const [idx, setIdx] = useState(0);
    return (
        <section className="section">
            <h2>Simulateur d’entretien</h2>
            <p>{data.questions[idx]}</p>
            <button
                onClick={()=>setIdx((prev)=> Math.min(prev+1, data.questions.length-1))}
                disabled={idx === data.questions.length-1}
            >
                {idx < data.questions.length-1 ? 'Suivant' : 'Terminer'}
            </button>
        </section>
    );
}
