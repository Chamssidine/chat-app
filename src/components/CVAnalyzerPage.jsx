// src/components/CVAnalyzerPage.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Dashboard from "./Dashboard";
import "./../HomePage.css";
import { handleFileInput } from "../utils/fileUtils.js";

// eslint-disable-next-line react/prop-types
const CVAnalyzerPage = ({ onUpload, JsonAnalysis }) => {
    const [pdfPreview, setPdfPreview] = useState(null);
    const [attachedFile, setAttachedFile] = useState(null);
    const [jobUrl, setJobUrl] = useState("");
    const [dashboardVisible, setDashboardVisible] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalyze = () => {
        if (!attachedFile || !jobUrl) {
            alert("Veuillez téléverser un CV et entrer l'URL du poste.");
            return;
        }
        onUpload({ file: attachedFile, text: `Analyser ce CV pour ce poste. URL:${jobUrl} n'oublie pas que tu dois repondre uniquement par le json` });
        setDashboardVisible(true);
    };

    const handleFileChange = async (e) => {
        await handleFileInput(e, null, setPdfPreview, (file) => {
            setAttachedFile(file);
        });
    };

    const clearPreview = () => {
        setPdfPreview(null);
        setAttachedFile(null);
        setDashboardVisible(false);
    };
    console.log(JsonAnalysis.length);

    return (
        <div className="analyzer-container">
            <h1 className="analyzer-title">Analyse de CV</h1>

            <div className="form-group">
                <label htmlFor="cv">Téléverser votre CV (PDF)</label>
                <input
                    type="file"
                    id="cv"
                    accept="application/pdf"
                    onChange={handleFileChange}
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

            <button className="analyze-btn" onClick={handleAnalyze}>
                Lancer l’analyse
            </button>

            {/* Show result buttons once JSON analysis arrives */}
            {JsonAnalysis && JsonAnalysis.length > 0 && (
                <div className="results-list">
                    {JsonAnalysis.map((item, index) => (
                        <button
                            key={index}
                            className="view-btn"
                            onClick={() => {
                                setAnalysisResult(item);
                                setDashboardVisible(true);
                            }}
                        >
                            Voir le résultat d’analyse #{index + 1} 📊
                        </button>
                    ))}
                </div>
            )}

            {pdfPreview && (
                <div className="pdf-preview">
                    <iframe
                        src={pdfPreview.url}
                        title="PDF Preview"
                        className="pdf-frame"
                    />
                    <p className="pdf-name">{pdfPreview.name}</p>
                    <button className="clear-btn" onClick={clearPreview}>
                        X
                    </button>
                </div>
            )}

            {/* Dashboard modal for displaying analysis result */}
            <Dashboard
                visible={dashboardVisible}
                onClose={() => setDashboardVisible(false)}
                analysisResult={analysisResult}
            />
        </div>
    );
};

export default CVAnalyzerPage;
