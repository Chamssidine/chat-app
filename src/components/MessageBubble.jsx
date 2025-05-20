// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy } from 'react-icons/fi';
import ImageFromJson from './ImageFromJson';
import { extractUrl } from './ImageFromJson';
import rehypeRaw from 'rehype-raw';
import './MessageBubble.css';

// eslint-disable-next-line react/prop-types
const MessageBubble = ({ text, sender, timestamp, imageUrl, image }) => {
  const copyToClipboard = (content) => navigator.clipboard.writeText(content);
  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const isProbablyImageUrl = (value) =>
      typeof value === 'string' && /^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i.test(value);

  const isUser = sender === 'user';
  const content = (
      <>
        {(image || imageUrl || isProbablyImageUrl(text)) && (
            <ImageFromJson
                content={image || imageUrl || text}
                onDownload={() => downloadImage(extractUrl(image || imageUrl || text))}
            />
        )}
        {!isProbablyImageUrl(text) && (
            <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="link">
                        {children}
                      </a>
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    const codeContent = String(children).trim();
                    if (inline) {
                      return <code className="inline-code" {...props}>{children}</code>;
                    }
                    return (
                        <div className="code-block">
                          <button onClick={() => copyToClipboard(codeContent)} className="copy-btn" title="Copier le code">
                            <FiCopy size={18} />
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
              {Array.isArray(text) ? text.map((p) => p.text || '').join('\n\n') : text}
            </ReactMarkdown>
        )}
        <div className="timestamp">{timestamp}</div>
      </>
  );

  return (text || imageUrl || image) ? (
      <div className={`message-row ${isUser ? 'user' : 'ai'}`}>
        {!isUser && <div className="avatar">🤖</div>}
        {isUser ? (
            <div className="bubble bubble-user">
              {content}
            </div>
        ) : (
            <div className="ai-content">
              {content}
            </div>
        )}
        {isUser && <div className="avatar-spacer" />}
      </div>
  ) : null;
};

export default MessageBubble;