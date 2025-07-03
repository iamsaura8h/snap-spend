
import React, { useState } from "react";
import axios from "axios";

const Sau2 = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.post(`${apiUrl}/ask-question`, {
        question,
      });

      const newAnswer = res.data.answer;
      setChatHistory((prev) => [...prev, { question, answer: newAnswer }]);
      setQuestion("");
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [...prev, { question, answer: "Something went wrong. Please try again." }]);
      setQuestion("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Financial Advisor AI</h1>
              <a href="/">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Back to Dashboard
                </button>
              </a>
            </div>
            <p className="text-gray-600 mt-2">Ask me anything about your finances and spending patterns</p>
          </div>

          <div className="p-6">
            {/* Chat History */}
            <div className="space-y-6 mb-6 max-h-96 overflow-y-auto">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">💬</div>
                  <p>Start by asking a financial question!</p>
                  <p className="text-sm mt-2">Examples: "How can I reduce my spending?" or "What's my biggest expense category?"</p>
                </div>
              ) : (
                chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                        <p className="text-sm">{chat.question}</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                        <p className="text-sm whitespace-pre-line">{chat.answer}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ask a financial question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                disabled={loading || !question.trim()}
              >
                {loading ? "Thinking..." : "Ask"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sau2;
