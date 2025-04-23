import React, { useState, useEffect } from "react";
import { LuBot, LuSendHorizontal } from "react-icons/lu";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import useChatbot from "../hooks/useChatbot";
import Markdown from "react-markdown";

const ChatComponent = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages, sendFeedback } = useChatbot();
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

  const handleFeedback = (messageIndex, verseId, isRelevant) => {
    const userMessage = messages[messageIndex - 1]?.text;
    console.log("Feedback triggered:", { userMessage, verseId, isRelevant });
    if (userMessage && verseId) {
      sendFeedback(userMessage, verseId, isRelevant);
    } else {
      console.error("Feedback failed: Missing userMessage or verseId", { userMessage, verseId });
      setMessages((prev) => [
        ...prev,
        {
          text: "Error: Could not submit feedback due to missing query or verse ID.",
          sender: "bot",
        },
      ]);
    }
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
            const [answer, ...quotes] = msg.text.split("\n\n");
            const showAllQuotes = expandedQuotes[index];
            const initialContent = answer;
            const verseIds = msg.verseIds || [];
            console.log("Rendering bot message:", { index, answer, quotes, verseIds });

            return (
              <div key={index} className="space-y-2">
                <div
                  id="ai-answer"
                  className="p-3 rounded-lg max-w-xs whitespace-pre-wrap bg-gray-300 text-gray-800"
                >
                  <Markdown>{initialContent}</Markdown>
                </div>
                {quotes.length > 0 ? (
                  <div className="space-y-2">
                    {(showAllQuotes ? quotes : quotes.slice(0, 1)).map((quote, quoteIndex) => (
                      <div key={quoteIndex} className="space-y-1">
                        <div
                          id={`ai-quote-${quoteIndex}`}
                          className="p-3 rounded-lg max-w-xs whitespace-pre-wrap bg-gray-200 text-gray-800"
                        >
                          <Markdown>{quote}</Markdown>
                        </div>
                        {verseIds[quoteIndex] ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleFeedback(index, verseIds[quoteIndex], true)}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors"
                              aria-label="Thumbs Up"
                            >
                              <FaThumbsUp size={16} />
                            </button>
                            <button
                              onClick={() => handleFeedback(index, verseIds[quoteIndex], false)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              aria-label="Thumbs Down"
                            >
                              <FaThumbsDown size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                          </div>
                        )}
                      </div>
                    ))}
                    {quotes.length > 1 && (
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
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500"></div>
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