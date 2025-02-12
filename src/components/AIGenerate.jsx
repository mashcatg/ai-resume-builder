import React from "react";
import { useState } from "react";
import api from "../utils/api";

const AIGenerate = ({ onGenerate }) => {
  const [text, setText] = useState("");
  const [improvedText, setImprovedText] = useState("");

  const handleGenerate = async () => {
    try {
      const response = await api.post("/ai/generate", { text });
      setImprovedText(response.data.improvedText);
      onGenerate(response.data.improvedText);
    } catch (error) {
      console.error("Error generating AI content:", error);
    }
  };

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter resume summary" required />
      <button onClick={handleGenerate}>Generate AI Content</button>
      <textarea value={improvedText} readOnly placeholder="AI improved content" />
    </div>
  );
};

export default AIGenerate;
