import React, { useState } from "react";
import SmartButtonOutlinedIcon from '@mui/icons-material/SmartButtonOutlined';

function AiTile() {

  // Controls open/close of AI chat panel
  const [isOpen, setIsOpen] = useState(false);

  // Stores current input text from user
  const [input, setInput] = useState("");

  // Stores chat messages history
  const [messages, setMessages] = useState([]);


  // Toggle chat window visibility
  function toggleChat() {
    setIsOpen(prev => !prev);
  }

  // Handle sending message to Guardian AI
  function handleSend(e) {

    e.preventDefault();

    // Prevent empty messages
    if (!input.trim()) return;

    // Create user message object
    const userMessage = {
      sender: "user",
      text: input
    };

    // Immediately show user message in UI
    setMessages(prev => [...prev, userMessage]);


    // OPENAI API FETCH

    fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    })
      .then(res => res.json())
      .then(data => {

        // Create AI reply message from backend response
        const aiReply = {
          sender: "ai",
          text: data.reply
        };

        // Add AI message to chat history
        setMessages(prev => [...prev, aiReply]);
      })
      .catch(err => {
        console.error(err);

        // fallback message 
        setMessages(prev => [...prev,
        { sender: "ai", text: "Guardian failed to respond." }
        ]);
      });

    // CLEARS INPUT FIELD after sending
    setInput("");

  }

  return (
    <div>

      <div className="ai-tile" onClick={toggleChat}>
        <SmartButtonOutlinedIcon style={{ fontSize: 45 }} />
      </div>


      {isOpen && (
        <div className="ai-chatbox">

          <div className="ai-header">
            Ask Guardian
          </div>

          <div className="ai-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "ai-message user"
                    : "ai-message ai"
                }
              >
                {msg.text}
              </div>
            ))}

          </div>

          <form className="ai-input-area" onSubmit={handleSend}>

            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button type="submit">Send</button>

          </form>

        </div>
      )}

    </div>
  );
}

export default AiTile;
