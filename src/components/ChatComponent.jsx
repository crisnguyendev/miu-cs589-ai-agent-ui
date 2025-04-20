import React, { useState, useEffect } from "react";
import { LuBot, LuSendHorizontal } from "react-icons/lu";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import useChatbot from "../hooks/useChatbot";
import Markdown from "react-markdown";

const ChatComponent = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages } = useChatbot();
  const [expandedQuotes, setExpandedQuotes] = useState({});

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

  const toggleQuotes = (messageIndex) => {
    setExpandedQuotes((prev) => ({
      ...prev,
      [messageIndex]: !prev[messageIndex],
    }));
  };

  return (
    <div className="flex flex-col w-full max-w-md bg-white rounded-lg">
      <h2 className="p-4 font-semibold text-lg text-center bg-blue-100 flex text-blue-800 justify-center items-center gap-2">
        Vedic Agent <LuBot size={25} />
      </h2>
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ paddingBottom: "2rem" }}
      >
        {messages.map((msg, index) => {
          if (msg.sender === "user") {
            return (
              <div
                key={index}
                id="user-question"
                className="p-3 rounded-lg max-w-xs whitespace-pre-wrap bg-blue-500 text-white ml-auto"
              >
                <Markdown>{msg.text}</Markdown>
              </div>
            );
          } else {
            // Split bot message into answer and quotes (if any)
            const [answer, ...quotes] = msg.text.split("\n\n");
            const showAllQuotes = expandedQuotes[index];
            const initialContent =
              quotes.length > 0 ? `${answer}\n\n${quotes[0]}` : answer;
            const remainingQuotes = quotes.slice(1);

            return (
              <div key={index} className="space-y-2">
                <div
                  id="ai-answer"
                  className="p-3 rounded-lg max-w-xs whitespace-pre-wrap bg-gray-300 text-gray-800"
                >
                  <Markdown>{initialContent}</Markdown>
                </div>
                {remainingQuotes.length > 0 && (
                  <div className="space-y-2">
                    {showAllQuotes && (
                      <div
                        id="ai-reply"
                        className="p-3 rounded-lg max-w-xs whitespace-pre-wrap bg-gray-300 text-gray-800 text-left"
                      >
                        <Markdown>{remainingQuotes.join("\n\n")}</Markdown>
                      </div>
                    )}
                    <button
                      onClick={() => toggleQuotes(index)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {showAllQuotes ? (
                        <>
                          Show less <FaChevronUp size={12} />
                        </>
                      ) : (
                        <>
                          Show more <FaChevronDown size={12} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          }
        })}
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
