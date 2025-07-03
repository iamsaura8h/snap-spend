// Test.tsx
import { useState } from "react";
import axios from "axios";

export default function Test() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any[]>([]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("csv", file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${apiUrl}/api/upload`, formData);
      setResult(res.data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">ExpenseSnap CSV Upload</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 rounded"
      />
      <button
        onClick={handleUpload}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Upload & Analyze
      </button>

      {result.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Categorized Transactions:</h2>
          <ul className="space-y-2">
            {result.map((txn, i) => (
              <li key={i} className="border p-2 rounded bg-gray-100">
                <strong>{txn.Description}</strong> — {txn.Amount} — Category:{" "}
                <span className="text-blue-700 font-medium">{txn.Category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
