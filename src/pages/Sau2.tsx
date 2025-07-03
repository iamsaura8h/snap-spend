import React, { useState } from "react";
import axios from "axios";

const Sau2 = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string }[]
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${apiUrl}/ask-question`, {
        question,
      });

      const newAnswer = res.data.answer;
      setChatHistory((prev) => [...prev, { question, answer: newAnswer }]);
      setAnswer(newAnswer);
      setQuestion(""); // Clear the input for next follow-up
    } catch (err) {
      console.error(err);
      setAnswer("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded-md shadow">
      <h1 className="text-2xl font-bold mb-4">Financial Advisor Q&A</h1>

      {chatHistory.map((chat, index) => (
        <div key={index} className="mb-6">
          <p className="font-semibold">Q: {chat.question}</p>
          <p className="text-gray-700 whitespace-pre-line">A: {chat.answer}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          className="w-full border p-2 rounded mb-2"
          placeholder="Ask a financial question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
    </div>
  );
};

export default Sau2;
