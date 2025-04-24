import React, { useState, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaChevronDown, FaChevronUp, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Markdown from "react-markdown";
import axios from "axios";
import "./ChatComponent.css";
import config from "../../config";

// Custom hook for chatbot logic
const useChatbot = () => {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (message) => {
    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);

    try {
      const response = await axios.get(`${config.API_URL}/answer`, {
        params: { query: message, k: 5 },
      });

      const answer = response.data.answer;
      const contexts = response.data.context || [];
      const verseIds = contexts.map((item, index) =>
        item.verse_id || `${item.source.replace(/\s+/g, "_").toLowerCase()}_${index}`
      );
      const quotes = contexts.map((item, index) => `**${index + 1}.** ${item.verse}\n${item.source}`);

      setMessages([...newMessages, { answer, quotes, sender: "bot", verseIds }]);
    } catch (error) {
      console.error("Error fetching from API:", error);
      setMessages([...newMessages, { answer: "Error: Could not fetch response.", quotes: [], sender: "bot" }]);
    }
  };

  const sendFeedback = async (query, verseId, isRelevant) => {
    try {
      await axios.post(`${config.API_URL}/feedback`, {
        query,
        verse_id: verseId,
        is_relevant: isRelevant,
      });
      setMessages((prev) => [...prev, { answer: "Feedback submitted!", quotes: [], sender: "bot" }]);
    } catch (error) {
      console.error("Error sending feedback:", error);
      setMessages((prev) => [...prev, { answer: "Feedback submission failed.", quotes: [], sender: "bot" }]);
    }
  };

  return { messages, sendMessage, setMessages, sendFeedback };
};

// ChatComponent
const ChatComponent = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages, sendFeedback } = useChatbot();
  const [expandedQuotes, setExpandedQuotes] = useState({});

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          answer: "🌟 Welcome to VedicSage! Ask me about Vedic wisdom 🙏",
          quotes: [],
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
    if (userMessage && verseId) {
      sendFeedback(userMessage, verseId, isRelevant);
    } else {
      setMessages((prev) => [...prev, { answer: "Error: Feedback submission failed.", quotes: [], sender: "bot" }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <FaRobot size={24} />
        <h2 className="chat-header-text">VedicSage</h2>
      </div>
      <div className="chat-area">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="message-wrapper"
            style={{ alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}
          >
            {msg.sender === "user" ? (
              <div className="user-message">
                <Markdown>{msg.text}</Markdown>
              </div>
            ) : (
              <div className="bot-message-container">
                {msg.answer && (
                  <div className="bot-message">
                    <Markdown>{msg.answer}</Markdown>
                  </div>
                )}
                {msg.quotes?.length > 0 && (
                  <div className="quotes-container">
                    {(expandedQuotes[index] ? msg.quotes : msg.quotes.slice(0, 1)).map((quote, quoteIndex) => (
                      <div key={quoteIndex} className="quote-wrapper">
                        <div className="quote">
                          <Markdown>{quote}</Markdown>
                        </div>
                        {msg.verseIds?.[quoteIndex] && (
                          <div className="feedback-buttons">
                            <button
                              onClick={() => handleFeedback(index, msg.verseIds[quoteIndex], true)}
                              className="feedback-button"
                              aria-label="Thumbs Up"
                            >
                              <FaThumbsUp size={16} color="#28a745" />
                            </button>
                            <button
                              onClick={() => handleFeedback(index, msg.verseIds[quoteIndex], false)}
                              className="feedback-button"
                              aria-label="Thumbs Down"
                            >
                              <FaThumbsDown size={16} color="#dc3545" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {msg.quotes.length > 1 && (
                      <button
                        onClick={() => toggleQuotes(index)}
                        className="toggle-button"
                      >
                        {expandedQuotes[index] ? (
                          <>
                            Show Less <FaChevronUp size={12} />
                          </>
                        ) : (
                          <>
                            Show More <FaChevronDown size={12} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask about Vedic wisdom..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="send-button">
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;