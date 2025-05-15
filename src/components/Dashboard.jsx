// src/components/Dashboard.jsx
import React from "react";
import FormatCheck from "./dashboard/FormatCheck";
import CareerTimeline from "./dashboard/CareerTimeline";
import SemanticAnalysis from "./dashboard/SemanticAnalysis";
import Benchmark from "./dashboard/Benchmark";
import SoftSkills from "./dashboard/SoftSkills";
import TrainingSuggestions from "./dashboard/TrainingSuggestions";
import CompletenessIndex from "./dashboard/CompletenessIndex";
import KeywordDensity from "./dashboard/KeywordDensity";
import NetworkGraph from "./dashboard/NetworkGraph";
import InterviewSimulator from "./dashboard/InterviewSimulator";
import dashboardData from "../data/dashboardData";
import "./../Dashboard.css";

const sections = [
    { key: "formatCheck", component: FormatCheck },
    { key: "careerTimeline", component: CareerTimeline },
    { key: "semanticAnalysis", component: SemanticAnalysis },
    { key: "benchmark", component: Benchmark },
    { key: "softSkills", component: SoftSkills },
    { key: "trainingSuggestions", component: TrainingSuggestions },
    { key: "completenessIndex", component: CompletenessIndex },
    { key: "keywordDensity", component: KeywordDensity },
    { key: "networkGraph", component: NetworkGraph },
    { key: "interviewSimulator", component: InterviewSimulator },
];

export default function Dashboard({ visible, onClose }) {
    return (
        <div className={`dashboard-panel ${visible ? "active" : ""}`}>
            <div className="button-row">
                <button className="btn close-btn" onClick={onClose}>
                    Fermer
                </button>
            </div>
            <div className="container">
                {sections.map(({ key, component: Section }) => {
                    const data = dashboardData[key];
                    if (!data) return null; // n'affiche pas si pas de données
                    return <Section key={key} data={data} />;
                })}
            </div>
        </div>
    );
}
