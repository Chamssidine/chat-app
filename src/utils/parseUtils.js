/**
 * Extrait le JSON contenu entre des balises ```json ... ```
 // ou entre simples backticks si nécessaire,
 // puis le parse en objet JS.
 * @param {string} content — Le string brut renvoyé par l'IA
 * @returns {object|null} — L'objet JSON parsé, ou null si échec
 */
export function extractJson(content) {
    let jsonString
    try {
        const regex = /```json\s*([\s\S]*?)```/;
        const match = regex.exec(content);
        jsonString = match ? match[1].trim() : content.trim();
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Parsing JSON failed:", e, jsonString);
        return null;
    }
}
/**
 * Convertit le JSON brut analysé en format dashboardData
 * @param {object} raw - Le JSON brut (pdfJsonAnalysis)
 * @returns {object} - Données au format dashboardData.js
 */
export function transformToDashboardData(raw) {
    try {
        raw = extractJson(raw);

        return {
            formatCheck: {
                score: raw.formatCheck?.score ?? 0,
                issues: raw.formatCheck?.issues ?? [],
            },
            careerTimeline: raw.careerTimeline ?? [],
            semanticAnalysis: {
                matchedKeywords: raw.semanticAnalysis?.matchedKeywords ?? 0,
                totalKeywords: raw.semanticAnalysis?.totalKeywords ?? 0,
                keywords: raw.semanticAnalysis?.keywords ?? [],
            },
            benchmark: {
                salaryPercentile: raw.benchmark?.salaryPercentile ?? 0,
                roleLevel: raw.benchmark?.roleLevel ?? "Inconnu",
            },
            softSkills: {
                communication: raw.softSkills?.communication ?? 0,
                leadership: raw.softSkills?.leadership ?? 0,
                adaptability: raw.softSkills?.adaptability ?? 0,
            },
            trainingSuggestions: raw.trainingSuggestions ?? [],
            completenessIndex: raw.completenessIndex ?? 0, // plus de *100
            keywordDensity: raw.keywordDensity ?? [],
            networkGraph: {
                nodes: raw.networkGraph?.nodes ?? [],
                links: raw.networkGraph?.links ?? [],
            },
            interviewSimulator: {
                questions: raw.interviewSimulator?.questions ?? [],
            },
        };
    } catch (e) {
        console.error("Transform failed", e, raw);
        return {};
    }
}

