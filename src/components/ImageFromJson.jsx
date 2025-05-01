import React, { useState } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';

// Utility to extract URL from content (string or object)
const extractUrl = (content) => {
  try {
    if (!content) return '';
    // Check if it's an object with a `url` field
    if (typeof content === 'object' && content.url) return content.url;
    // If it's a JSON string, parse and extract URL
    const parsed = typeof content === 'string' ? JSON.parse(content) : null;
    return parsed?.url || '';
  } catch {
    // Return as is if not parsable, might be a direct string
    return typeof content === 'string' ? content : '';
  }
};

const ImageFromJson = ({ content, onDownload }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const url = extractUrl(content);

  // If no URL, return nothing
  if (!url) return null;

  return (
    <>
      {/* Image thumbnail */}
      <div className="relative group">
        <img
          src={url}
          alt="Generated"
          className="w-full h-auto rounded-lg cursor-pointer transition hover:brightness-90"
          onClick={() => setIsFullscreen(true)}
        />
        <button
          onClick={onDownload}
          className="absolute top-2 right-2 bg-white/70 hover:bg-white p-2 rounded-full"
          title="Télécharger l'image"
        >
          <FiDownload className="text-black" size={18} />
        </button>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative max-w-5xl w-full p-4 bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image area
          >
            <img src={url} alt="Fullscreen" className="w-full h-auto rounded-lg" />
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent modal close when clicking on button
                setIsFullscreen(false);
              }}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full"
              title="Fermer"
            >
              <FiX className="text-black" size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageFromJson;
