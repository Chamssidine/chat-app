import React, { useEffect, useState } from "react";
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

export default function Dashboard({ visible, onClose, analysisResult }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            setLoading(true);
            // Dès que nous avons analysisResult, on arrête le loading
            if (analysisResult) setLoading(false);
        } else {
            setLoading(true);
        }
    }, [visible, analysisResult]);

    return (
        <div className={`dashboard-panel ${visible ? "active" : ""}`}>
            <div className="button-row">
                <button className="btn close-btn" onClick={onClose}>
                    Fermer
                </button>
            </div>
            <div className="container">
                {loading || !analysisResult ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="section skeleton">
                            <div className="skeleton-title" />
                            <div className="skeleton-line short" />
                            <div className="skeleton-line long" />
                        </div>
                    ))
                ) : (
                    sections.map(({ key, component: Section }) => {
                        const data = analysisResult[key];
                        if (!data) return null;
                        return <Section key={key} data={data} />;
                    })
                )}
            </div>
        </div>
    );
}
