import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiDownload } from 'react-icons/fi';

const MessageBubble = ({ text, sender, timestamp, imageUrl, image }) => {
  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
  };

  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex flex-col my-2 mx-4 transition-transform duration-300 ${sender === 'user' ? 'items-end' : 'items-start'}`}>
      <div className={`relative px-3 py-2 max-w-xl mx-auto rounded-lg shadow-md transition-all duration-300 transform ${sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${sender === 'user' ? 'mr-2' : 'ml-2'}`}>
        
        {image || imageUrl ? (
          <div className="relative mb-2">
            <img src={image || imageUrl} alt="Uploaded" className="w-full h-auto rounded-lg" />
            <button
              onClick={() => downloadImage(image || imageUrl)}
              className="absolute top-2 right-2 bg-white/70 hover:bg-white p-2 rounded-full"
              title="Télécharger l'image"
            >
              <FiDownload className="text-black" size={18} />
            </button>
          </div>
        ) : null}

        <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const codeContent = String(children).trim();
                if (inline) {
                  return (
                    <code className="bg-gray-200 rounded px-1" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <div className="relative mb-2">
                    <button
                      onClick={() => copyToClipboard(codeContent)}
                      className="absolute top-2 right-2 bg-white/70 hover:bg-white p-2 rounded-full"
                      title="Copier le code"
                    >
                      <FiCopy className="text-black" size={18} />
                    </button>
                    <SyntaxHighlighter
                      style={oneDark}
                      language="javascript"
                      PreTag="div"
                      customStyle={{ borderRadius: '8px', fontSize: '14px' }}
                      {...props}
                    >
                      {codeContent}
                    </SyntaxHighlighter>
                  </div>
                );
              },
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
    </div>
  );
};

export default MessageBubble;