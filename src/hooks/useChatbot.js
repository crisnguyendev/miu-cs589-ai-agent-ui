import { useState } from "react";
import axios from "axios";

const useChatbot = () => {
  const [messages, setMessages] = useState([]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const sendMessage = async (message) => {
    await delay(1000);
    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);

    try {
      const response = await axios.get("http://localhost:8000/retrieve", {
        params: { query: message, k: 5 },
      });

      const results = response.data.results;

      const botReply = results
        .map(
          (item, index) =>
            `${index + 1}. ${item.verse} \n📚 Source: ${item.source}`
        )
        .join("\n\n");

      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
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

  return { messages, sendMessage, setMessages };
};

export default useChatbot;
