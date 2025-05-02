import React, { useState } from "react";
import axios from "axios";
import { FileUp } from "lucide-react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [categorizedData, setCategorizedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file first.");

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/analyze-transactions", formData);
      setCategorizedData(response.data);
    } catch (error) {
      alert("Failed to analyze transactions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">🧾 Transaction Categorizer</h1>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Analyzing..." : "Upload & Categorize"}
        </button>

        {categorizedData.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Results</h2>
            <div className="overflow-auto">
              <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {categorizedData.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{item.description}</td>
                      <td className="p-2 border">{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
