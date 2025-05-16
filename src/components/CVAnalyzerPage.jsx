// src/components/CVAnalyzerPage.jsx
import React,{ useState } from "react";
import Dashboard from "./Dashboard";
import "./../HomePage.css";
import { v4 as uuidv4 } from 'uuid';
import {handleFileInput} from "../utils/fileUtils.js";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const CVAnalyzerPage = ({ onUpload, gptModel }) => {
    const [pdfPreview, setPdfPreview] = useState(null);
    const [attachedFile, setAttachedFile] = useState(null);
    const [jobUrl, setJobUrl] = useState("");
    const [dashboardVisible, setDashboardVisible] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);

    const sendPDF = async (file) => {
        if(!file) return;
        try {
            const systemMessage ={
                _id: Date.now(),
                role: "system",
                content: file.text,
                image: file.file?.type === "image" ? file.file.data : null,
                file: file.file?.type === "pdf" ? file.file : null,
                sessionId:uuidv4(),
            }

            const payload = {
                model:gptModel,
                sessionId:systemMessage.sessionId,
                userId: "id_123",
                role:systemMessage.role,
                message:systemMessage.content,
                file:file.file,
                image:systemMessage.image,

            }
            const response = await axios.post("http://localhost:3000/api/chat", payload);
            setAnalysisResults(response);
            console.log(response);

        }catch (error){
            console.error("Error sending message:", error);
        }

    }
    const handleAnalyze = () => {
        if (!attachedFile || !jobUrl) {
            alert("Veuillez téléverser un CV et entrer l'URL du poste.");
            return;
        }
        // Optional: trigger parent upload callback
        if (typeof onUpload === 'function') {

            sendPDF({ file: attachedFile, text: "Analyser ce CV pour ce poste "+jobUrl });
        }
        setDashboardVisible(true);
    };
    const handleFileChange = async (e) => {
          await handleFileInput(e, null, setPdfPreview, setAttachedFile);
    };

    const clearPreview = () => {
        setPdfPreview(null);

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

            <Dashboard visible={dashboardVisible} onClose={() => setDashboardVisible(false)} analysisResult= {analysisResults} />
        </div>
    );
};

export default CVAnalyzerPage;



