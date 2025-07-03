import React, { useState } from "react";
import axios from "axios";
import { FileUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import PieChart from "@/components/charts/PieChart"; // Assuming you have a PieChart component
import { categoryTotals, formatCurrency } from "@/lib/demo-data";

const Analyse = () => {
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
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${apiUrl}/analyze-transactions`, formData);
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
        {/* File Upload Section */}
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

        {/* Category Breakdown Analysis */}
        <div className="space-y-8 mt-6">
          <h1 className="text-3xl font-bold">Spending Breakdown</h1>
          
          {/* Category Breakdown Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Category-wise Spending</CardTitle>
              <CardDescription>Visual representation of your spending across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PieChart data={categorizedData} /> {/* Assuming PieChart component receives categorizedData */}
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown Details */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {categoryTotals.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{category.category}</h4>
                      <span>{formatCurrency(category.total)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      {category.percentage}% of your total expenses
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analyse;
