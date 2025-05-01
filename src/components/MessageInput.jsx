
import React, { useState, useRef } from "react";
import { FaPlus, FaPaperPlane, FaImage, FaMicrophone } from "react-icons/fa";
export default function MessageInput({ value, onChange, onSend, onImageSelect,onFileSelect }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // très important !
      reader.onload = () => {
        // Supprimer le préfixe "data:application/pdf;base64," si besoin
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  const handleSend = () => {
    const fileData = attachedFile
      ? {
          type: attachedFile.type,
          data: attachedFile.data,
          name: attachedFile.name,
        }
      : null;
  
    onSend({
      text: value.trim(),
      file: fileData,
    });
  
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  
    // Reset tous les états
    setImagePreview(null);
    setPdfPreview(null);
    setAttachedFile(null);
    setIsRecording(false);
  
    // Réinitialiser la valeur du champ texte via props
    onChange("");
  };
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setAttachedFile({
          type: "image",
          data: reader.result,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      const filebase64 = await convertFileToBase64(file)
      setPdfPreview({ name: file.name, url: fileURL });
      setAttachedFile({
        type: "pdf",
        data: filebase64,
        name: file.name,
      });
    }
  };

  const toggleRecording = () => {
    setIsRecording((prevState) => !prevState);
  };

  const clearPreview = () => {
    setImagePreview(null);
    setPdfPreview(null);
    setAttachedFile(null);
  };

  return (
    <div className="w-full p-4 bg-gray-50 flex justify-center max-h-64">
      <div className="w-full max-w-2xl">
        <div className="flex items-end p-2 bg-white shadow-md rounded-2xl">
          {/* FaPlus for file input */}
          <button
            className="p-2 text-gray-600 hover:text-blue-500 transition"
            onClick={() => fileInputRef.current.click()}
          >
            <FaPlus size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

<textarea
  ref={textareaRef}
  rows={1}
  maxLength={500}
  className="flex-1 mx-4 p-2 rounded-2xl bg-gray-100 focus:outline-none resize-none overflow-auto max-h-82"
  placeholder="Posez votre question..."
  value={value}
  onChange={onChange}
  onInput={(e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"; // 128px = max-h-32
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }}
/>


          {/* Image Preview */}
          {imagePreview && (
            <div className="relative flex flex-col items-center mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg"
              />
              <button
                onClick={clearPreview}
                className="absolute top-0 right-0 text-white bg-red-500 p-1 rounded-full w-6 h-6 item-center"
              >
                X
              </button>
            </div>
          )}

          {/* PDF Preview */}
          {pdfPreview && (
            <div className="relative flex flex-col items-center mt-2">
              <iframe
                src={pdfPreview.url}
                title="PDF Preview"
                className="w-24 h-24 rounded-lg"
              ></iframe>
              <p className="text-xs mt-1">{pdfPreview.name}</p>
              <button
                onClick={clearPreview}
                className="absolute top-0 right-0 text-white bg-red-500 p-1 rounded-full w-6 h-6 item-center"
              >
                X
              </button>
            </div>
          )}

          <div className="flex space-x-2 items-end">
            <button
              onClick={toggleRecording}
              className={`p-2 text-gray-600 hover:text-blue-500 transition ${isRecording ? "bg-red-500" : ""}`}
            >
              <FaMicrophone size={20} />
            </button>

            <button
              onClick={handleSend}
              disabled={!value.trim() && !attachedFile}
              className={`p-2 rounded-full ${value.trim() || attachedFile ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"}`}
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
