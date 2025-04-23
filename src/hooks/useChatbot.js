import { useState } from "react";
import axios from "axios";
import config from "../config";

const useChatbot = () => {
  const [messages, setMessages] = useState([]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const sendMessage = async (message) => {
    await delay(1000);
    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);

    try {
      const response = await axios.get(`${config.API_URL}/answer`, {
        params: { query: message, k: 5 },
      });
      console.log("API response:", response.data);

      const answer = response.data.answer;
      const contexts = response.data.context || [];
      // Generate fallback verse IDs if not provided
      const verseIds = contexts.map((item, index) =>
        item.verse_id || `fallback_${item.source.replace(/\s+/g, "_").toLowerCase()}_${index}`
      );
      console.log("Extracted verseIds:", verseIds);

      const botReply = `Answer: ${answer}\n\n${contexts
        .map(
          (item, index) =>
            `${index + 1}. ${item.verse}\n📚 Source: ${item.source}`
        )
        .join("\n\n")}`;

      setMessages([
        ...newMessages,
        { text: botReply, sender: "bot", verseIds },
      ]);

      if (verseIds.some((id) => id.startsWith("fallback_"))) {
        setMessages((prev) => [
          ...prev,
          {
            text: "",
            sender: "bot",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching from FastAPI:", error);
      setMessages([
        ...newMessages,
        {
          text: "Sorry, I couldn't fetch a response from the server.",
          sender: "bot",
        },
      ]);
    }
  };

  const sendFeedback = async (query, verseId, isRelevant) => {
    console.log("Sending feedback:", { query, verse_id: verseId, is_relevant: isRelevant });
    try {
      console.log({
        query,
        verse_id: verseId,
        is_relevant: isRelevant,
      });
      const response = await axios.post(`${config.API_URL}/feedback`, {
        query,
        verse_id: verseId,
        is_relevant: isRelevant,
      });
      console.log("Feedback response:", response.data);
      setMessages((prev) => [
        ...prev,
        {
          text: "Thank you for your feedback!",
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("Error sending feedback:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, there was an issue submitting your feedback.",
          sender: "bot",
        },
      ]);
    }
  };

  return { messages, sendMessage, setMessages, sendFeedback };
};

export default useChatbot;