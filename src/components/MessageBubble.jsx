// eslint-disable-next-line no-unused-vars
  import React from 'react';
  import ReactMarkdown from 'react-markdown';
  import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
  import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
  import { FiCopy } from 'react-icons/fi';
  import ImageFromJson from './ImageFromJson';
  import { extractUrl } from './ImageFromJson';
  import rehypeRaw from 'rehype-raw';


// eslint-disable-next-line react/prop-types
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
    const isProbablyImageUrl = (value) => {
      if (typeof value !== 'string') return false;
      return value.match(/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i);
    };


    const isUser = sender === 'user';
    return (
      
        text ||imageUrl ||image? (
            < div className={`flex flex-col my-4 px-4 transition-all duration-300 ease-out animate-fade-in ${isUser ? 'items-end' : 'items-start'}`
            }>
              <div className="relative flex gap-2 items-start max-w-xl w-full">
                {/* Avatar (optional icon for AI or initials) */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-bold text-white">
                    🤖
                  </div>
                )}

                <div className={`
                  relative px-4 py-3 rounded-2xl shadow-md
                  ${isUser
                            ? 'bg-gray-100 dark:bg[#e3f2fd] dark:text-gray-600'
                            : 'bg-gray-100 text-gray-100 dark:bg-[#eef0f2] dark:text-gray-600'}
                  w-full
                `}>
                  {/*Image rendu */}
                  {(image || imageUrl || isProbablyImageUrl(text)) && (
                      <ImageFromJson
                          content={image || imageUrl || text}
                          onDownload={() => downloadImage(extractUrl(image || imageUrl || text))}
                      />
                  )}

                  {/* Markdown content */}
                  {/* Only render text if it's not just a pure image URL */}
                  {!isProbablyImageUrl(text) && (
                      <div className="prose prose-base dark:prose-invert prose-pre:rounded-lg prose-headings:font-semibold prose-p:leading-relaxed prose-img:rounded-lg max-w-none whitespace-pre-wrap">
                        <ReactMarkdown
                            rehypePlugins={[rehypeRaw]}
                            components={{

                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                                    >
                                        {children}
                                    </a>),
                              // eslint-disable-next-line no-unused-vars
                              code({ node, inline, className, children, ...props }) {
                                const codeContent = String(children).trim();
                                if (inline) {
                                  return (
                                      <code className="bg-gray-200 text-sm rounded px-1 dark:bg-gray-700 dark:text-white" {...props}>
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

                            {Array.isArray(text)
                                // eslint-disable-next-line react/prop-types
                                ? text.map(part => (part.text || '')).join('\n\n')
                                : text}

                        </ReactMarkdown>
                      </div>
                    )}


                  {/* Timestamp badge */}
                  <div className="absolute -bottom-4 right-2 text-[10px] text-gray-600 dark:text-gray-300 ">
                    {timestamp}
                  </div>
                </div>
              </div>
            </div >
          
        ): null
      
    );
  };

  export default MessageBubble;
