// Dashboard.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import "./../Dashboard.css";

const Dashboard = ({ visible, onClose }) => {
    return (
        <div className={`dashboard-panel ${visible ? "active" : ""}`}>
            <button className="close-btn" onClick={onClose}>
                Fermer
            </button>

            <div className="section">
                <h2>Score Global</h2>
                <div className="score-circle">78%</div>
                <p style={{ textAlign: "center" }}>🔎 Vous êtes sur la bonne voie !</p>
            </div>

            <div className="section">
                <h2>Compétences Correspondantes</h2>
                <ul>
                    <li>✔️ Développement mobile (Android)</li>
                    <li>✔️ UI/UX avec Jetpack Compose</li>
                    <li>✔️ Firebase Auth & Firestore</li>
                </ul>
            </div>

            <div className="section">
                <h2>Compétences Manquantes</h2>
                <ul>
                    <li>❌ Tests automatisés</li>
                    <li>❌ Intégration continue</li>
                </ul>
            </div>

            <div className="section">
                <h2>Conseils Personnalisés</h2>
                <ul>
                    <li>📌 Ajoutez des résultats mesurables</li>
                    <li>📌 Mentionnez vos projets GitHub</li>
                    <li>📌 Préparez vos soft skills</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
