import React, { useState, useRef } from "react";
import { FaPlus, FaPaperPlane, FaImage, FaMicrophone } from "react-icons/fa";

export default function MessageInput({ value, onChange, onSend , onImageSelect}) {
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [isRecording, setIsRecording] = useState(false); // State for recording status
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    onSend();
    if (textareaRef.current) {
      // Reset textarea height after sending
      textareaRef.current.style.height = "auto";
    }
    setImagePreview(null); // Clear image preview after sending
  };

  // Handle image file selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle microphone recording
  const toggleRecording = () => {
    setIsRecording((prevState) => !prevState); // Toggle recording state
  };

  return (
    <div className="w-full p-4 bg-gray-50 flex justify-center max-h-64">
      <div className="w-full max-w-2xl">
        <div className="flex items-end p-2 bg-white shadow-md rounded-2xl">
          <button className="p-2 text-gray-600 hover:text-blue-500 transition">
            <FaPlus size={20} />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-1 mx-4 p-2 rounded-2xl bg-gray-100 focus:outline-none resize-none overflow-hidden"
            placeholder="Posez votre question..."
            value={value}
            onChange={onChange}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          {/* Image Upload and Preview */}
          {imagePreview && (
            <div className="relative flex flex-col items-center mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-0 right-0 text-white bg-red-500 p-1 rounded-full w-6 h-6 item-center"
              >
                X
              </button>
            </div>
          )}

          <div className="flex space-x-2 items-end">
            {/* Image Upload Button */}
            <label htmlFor="image-upload" className="p-2 text-gray-600 hover:text-blue-500 transition">
              <FaImage size={20} />
            </label>
            <input
              id="image-upload"
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Microphone (Recording) Button */}
            <button
              onClick={toggleRecording}
              className={`p-2 text-gray-600 hover:text-blue-500 transition ${isRecording ? "bg-red-500" : ""}`}
            >
              <FaMicrophone size={20} />
            </button>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!value.trim() && !imagePreview}
              className={`p-2 rounded-full ${value.trim() || imagePreview ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"}`}
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
