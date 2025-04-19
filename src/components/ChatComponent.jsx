import React, { useState, useEffect } from "react";
import { LuBot, LuSendHorizontal } from "react-icons/lu";
import useChatbot from "../hooks/useChatbot";
import Markdown from "react-markdown";

const ChatComponent = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages } = useChatbot();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "🧘‍♂️ Welcome to the VedicSage Bot!\n\nAsk me anything about the Vedic verses 🙏",
          sender: "bot",
        },
      ]);
    }
  }, [messages, setMessages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md bg-white rounded-lg">
      <h2 className="p-4 font-semibold text-lg text-center bg-blue-100 flex text-blue-800 justify-center items-center gap-2">
        Vedic Agent <LuBot size={25} />
      </h2>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-96">
        {messages.map((msg, index) => (
          <div
            key={index}
            id="ai-reply"
            className={`p-3 rounded-lg max-w-xs whitespace-pre-wrap ${
              msg.sender === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            <Markdown>{msg.text}</Markdown>
          </div>
        ))}
      </div>
      <div className="flex items-center p-4 bg-white">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none"
          placeholder="Your message here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} className="p-2">
          <LuSendHorizontal size={25} />
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;