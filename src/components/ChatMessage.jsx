const ChatMessage = ({ msg }) => {
  const { type, content, from } = msg;

  const renderContent = () => {
    if (type === "text") {
      return <p>{content}</p>;
    } else if (type === "file") {
      return (
        <a
          href={URL.createObjectURL(content)}
          download={content.name}
          className="text-blue-400 underline"
        >
          {content.name}
        </a>
      );
    }
  };

  return (
    <div
      className={`p-4 rounded-lg my-2 ${
        from === "user" ? "bg-blue-600 self-end" : "bg-gray-700"
      } text-white`}
    >
      {renderContent()}
    </div>
  );
};
