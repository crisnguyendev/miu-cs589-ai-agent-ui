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
      
      const answer = response.data.answer;
      const contexts = response.data.context;
      
      // Construct botReply with answer first, followed by context quotes
      const botReply = `Answer: ${answer}\n\n${contexts
        .map(
          (item, index) =>
            `${index + 1}. ${item.verse}\n📚 Source: ${item.source}`
        )
        .join("\n\n")}`;

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