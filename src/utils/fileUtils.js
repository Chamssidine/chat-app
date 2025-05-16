// src/utils/fileUtils.js

/**
 * Convertit un File en base64 (Data URL) et renvoie uniquement la partie base64.
 * @param {File} file
 * @returns {Promise<string>} la données base64 (sans préfixe).
 */
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const [prefix, base64] = reader.result.split(',');
            resolve(base64);
        };
        reader.onerror = reject;
    });
}

/**
 * Gère l'upload d'un fichier image ou PDF, met à jour les états de preview et attachedFile.
 * @param {Event} event    L'événement onChange du <input type="file">
 * @param {Function} setImagePreview
 * @param {Function} setPdfPreview
 * @param {Function} setAttachedFile
 */
export async function handleFileInput(
    event,
    setImagePreview,
    setPdfPreview,
    setAttachedFile
) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setAttachedFile({
                type: 'image',
                data: reader.result,
                name: file.name,
            });
        };
        reader.readAsDataURL(file);

    } else if (file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        const base64 = await fileToBase64(file);
        setPdfPreview({ name: file.name, url });
        setAttachedFile({
            type: 'pdf',
            data: base64,
            name: file.name,
        });

    }
}
