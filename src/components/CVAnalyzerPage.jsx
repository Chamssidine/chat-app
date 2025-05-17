// src/components/CVAnalyzerPage.jsx
import React, { useState } from "react";
import Dashboard from "./Dashboard";
import "./../HomePage.css";
import { v4 as uuidv4 } from 'uuid';
import { handleFileInput } from "../utils/fileUtils.js";
import { extractJson } from "../utils/parseUtils.js";
import axios from "axios";

const CVAnalyzerPage = ({ onUpload, gptModel }) => {
    const [pdfPreview, setPdfPreview] = useState(null);
    const [attachedFile, setAttachedFile] = useState(null);
    const [jobUrl, setJobUrl] = useState("");
    const [dashboardVisible, setDashboardVisible] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const sendPDF = async (file) => {
        if (!file) return;
        try {
            const sessionId = uuidv4();
            const payload = {
                model: gptModel,
                sessionId,
                userId: "id_123",
                role: "system",
                message: file.text,
                file: file.file,
                image: null,
            };
            const response = await axios.post(
                "http://localhost:3000/api/chat",
                payload
            );
            const parsed = extractJson(response.data.content);
            if (parsed) {
                setAnalysisResult(parsed);
              } else {
             console.warn("Aucun JSON valide détecté dans la réponse IA");
            }

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleAnalyze = () => {
        if (!attachedFile || !jobUrl) {
            alert("Veuillez téléverser un CV et entrer l'URL du poste.");
            return;
        }
        // Reset previous results and show dashboard
        setAnalysisResult(null);
        setDashboardVisible(true);
        // Send to backend
        sendPDF({ file: attachedFile, text: `Analyser ce CV pour ce poste ${jobUrl} n'oublie pas que tu dois repondre uniquement par le json` });
    };

    const handleFileChange = async (e) => {
        await handleFileInput(e, null, setPdfPreview, (file) => {
            setAttachedFile(file);
        });
    };

    const clearPreview = () => {
        setPdfPreview(null);
        setAttachedFile(null);
        setAnalysisResult(null);
        setDashboardVisible(false);
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

            {analysisResult && (
                <button
                    className="analyze-btn view-btn"
                    onClick={() => setDashboardVisible(true)}
                >
                    Voir le résultat d’analyse
                </button>
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

            <Dashboard
                visible={dashboardVisible}
                onClose={() => setDashboardVisible(false)}
                analysisResult={analysisResult}
            />
        </div>
    );
};

export default CVAnalyzerPage;
