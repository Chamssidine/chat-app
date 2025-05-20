/**
 * Extrait le JSON contenu entre balises ```json ... ``` ou simples backticks
 * puis le parse en objet JS.
 * @param {string} content — Le string brut renvoyé par l'IA
 * @returns {object|null} — L'objet JSON parsé, ou null si échec
 */
export function extractJson(content) {
    let jsonString = '';
    try {
        // Regex pour bloc entre ```json ... ```
        const tripleBacktickJson = /```json\s*([\s\S]*?)```/i;
        // Regex pour bloc entre simples ```
        const tripleBacktick = /```([\s\S]*?)```/;
        // Regex pour bloc entre simples ` `
        const singleBacktick = /`([^`]*)`/;

        let match =
            tripleBacktickJson.exec(content) ||
            tripleBacktick.exec(content) ||
            singleBacktick.exec(content);

        jsonString = match ? match[1].trim() : content.trim();
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('Parsing JSON failed:', e, '\nJSON extrait:\n', jsonString);
        return null;
    }
}

/**
 * Convertit le JSON brut analysé en format dashboardData
 * @param {object|string} raw - Le JSON brut (pdfJsonAnalysis)
 * @returns {object} - Données au format dashboardData.js
 */
export function transformToDashboardData(raw) {
    try {
        raw = typeof raw === 'string' ? extractJson(raw) : raw;
        if (!raw || typeof raw !== 'object') throw new Error("Format JSON non valide.");

        return {
            formatCheck: {
                score: raw.formatCheck?.score ?? 0,
                issues: raw.formatCheck?.issues ?? [],
            },
            careerTimeline: raw.careerTimeline ?? [],
            semanticAnalysis: {
                matchedKeywords: raw.semanticAnalysis?.matchedKeywords ?? 0,
                totalKeywords: raw.semanticAnalysis?.totalKeywords ?? 0,
                keywordsDetail: raw.semanticAnalysis?.keywordsDetail ?? [],
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
            completenessIndex: raw.completenessIndex ?? 0,
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
        console.error("Transformation JSON vers dashboardData échouée:", e, raw);
        return {};
    }
}
