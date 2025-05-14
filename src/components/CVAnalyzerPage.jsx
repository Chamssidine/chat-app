// CVAnalyzerPage.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Dashboard from "./Dashboard";
import "./../Dashboard.css"; // tu peux aussi renommer ce fichier si tu veux

const CVAnalyzerPage = () => {
    const [dashboardVisible, setDashboardVisible] = useState(false);
    const [cvFile, setCvFile] = useState(null);
    const [jobUrl, setJobUrl] = useState("");

    const handleAnalyze = () => {
        if (!cvFile || !jobUrl) {
            alert("Veuillez téléverser un CV et entrer l'URL du poste.");
            return;
        }

        // Simulation d’analyse
        setTimeout(() => {
            setDashboardVisible(true);
        }, 500);
    };

    return (
        <div className="container">
            <h1>Analyse de votre CV</h1>

            <label htmlFor="cv">Téléversez votre CV (PDF)</label>
            <input
                type="file"
                id="cv"
                accept="application/pdf"
                onChange={(e) => setCvFile(e.target.files[0])}
            />

            <label htmlFor="jobUrl">URL de l'offre d'emploi</label>
            <input
                type="url"
                id="jobUrl"
                placeholder="https://exemple.com/offre"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
            />

            <button onClick={handleAnalyze}>Analyser</button>

            <Dashboard visible={dashboardVisible} onClose={() => setDashboardVisible(false)} />
        </div>
    );
};

export default CVAnalyzerPage;
