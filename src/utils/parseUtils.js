/**
 * Extrait le JSON contenu entre des balises ```json ... ```
 // ou entre simples backticks si nécessaire,
 // puis le parse en objet JS.
 * @param {string} content — Le string brut renvoyé par l'IA
 * @returns {object|null} — L'objet JSON parsé, ou null si échec
 */
export function extractJson(content) {
    // Cherche un bloc ```json ... ```
    const regex = /```json\s*([\s\S]*?)```/;
    const match = regex.exec(content);
    let jsonString = match ? match[1].trim() : content.trim();

    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Parsing JSON failed:", e, jsonString);
        return null;
    }
}
