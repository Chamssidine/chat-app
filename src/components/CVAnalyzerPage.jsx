import React, { useState } from "react";
import Dashboard from "./Dashboard";
import "./../HomePage.css";

const CVAnalyzerPage = () => {
    const [dashboardVisible, setDashboardVisible] = useState(false);
    const [cvFile, setCvFile] = useState(null);
    const [jobUrl, setJobUrl] = useState("");

    const handleAnalyze = () => {
        if (!cvFile || !jobUrl) {
            alert("Veuillez téléverser un CV et entrer l'URL du poste.");
            return;
        }

        setTimeout(() => {
            setDashboardVisible(true);
        }, 500);
    };

    return (
        <div className="analyzer-container">
            <h1 className="analyzer-title">Analyse de CV</h1>

            <div className="form-group">
                <label htmlFor="cv">Téléverser votre CV (PDF)</label>
                <input
                    type="file"
                    id="cv"
                    accept="application/pdf"
                    onChange={(e) => setCvFile(e.target.files[0])}
                />
            </div>

            <div className="form-group">
                <label htmlFor="jobUrl">Lien de l'offre d'emploi</label>
                <input
                    type="url"
                    id="jobUrl"
                    placeholder="https://exemple.com/offre"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                />
            </div>

            <button className="analyze-btn left" onClick={handleAnalyze}>
                Lancer l’analyse
            </button>

            <button className= "" onClick={handleAnalyze}>
                Voir Resultat
            </button>
             <Dashboard visible={dashboardVisible} onClose={() => setDashboardVisible(false)} />
        </div>
    );
};

export default CVAnalyzerPage;
