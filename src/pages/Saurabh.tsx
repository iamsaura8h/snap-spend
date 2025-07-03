
import React, { useState, useRef } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function Saurabh() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Handle CSV upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("csvFile", file);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/analyze-transactions`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      alert("Upload failed!");
    }
    setLoading(false);
  };

  // Day-wise expenditure (Line chart)
  const getDayWiseData = () => {
    if (!data) return { labels: [], datasets: [] };
    const dayMap: { [key: number]: number } = {};
    data.categorized.forEach((t: any) => {
      if (t.category !== "Income") {
        const day = parseInt(t.date.split("-")[2], 10);
        if (!dayMap[day]) dayMap[day] = 0;
        dayMap[day] += t.amount;
      }
    });
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const expenditures = days.map((d) => dayMap[d] || 0);
    return {
      labels: days,
      datasets: [
        {
          label: "Expenditure (₹)",
          data: expenditures,
          fill: false,
          borderColor: "blue",
          backgroundColor: "blue",
          pointRadius: 4,
          tension: 0.15,
        },
      ],
    };
  };

  // Category-wise spending (Bar & Pie chart)
  const getCategoryData = () => {
    if (!data) return { labels: [], datasets: [] };
    const catTotals: { [key: string]: number } = {};
    data.categorized.forEach((t: any) => {
      if (!catTotals[t.category]) catTotals[t.category] = 0;
      catTotals[t.category] += t.amount;
    });
    const categories = Object.keys(catTotals);
    const values = categories.map((cat) => catTotals[cat]);
    const colors = [
      "#4caf50", "#2196f3", "#f44336", "#ff9800", "#9c27b0", "#3f51b5", "#607d8b"
    ];
    return {
      labels: categories,
      datasets: [
        {
          label: "Amount (₹)",
          data: values,
          backgroundColor: colors,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">ExpenseSnap - Transaction Analyzer</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <input
              type="file"
              accept=".csv"
              ref={fileInput}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInput.current?.click()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mr-4"
            >
              {loading ? "Uploading..." : "Upload CSV"}
            </button>
            <a href="/chatbot">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Financial Chatbot
              </button>
            </a>
          </div>
        </div>

        {data && (
          <div className="space-y-6">
            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-600">Total Inflow</h4>
                <div className="text-2xl font-bold text-green-600">₹{data.analytics.totalInflow}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-600">Total Outflow</h4>
                <div className="text-2xl font-bold text-red-600">₹{data.analytics.totalOutflow}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-600">First Half</h4>
                <div className="text-lg font-semibold">₹{data.analytics.halfMonthComparison.firstHalf}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h4 className="text-sm font-medium text-gray-600">Second Half</h4>
                <div className="text-lg font-semibold">₹{data.analytics.halfMonthComparison.secondHalf}</div>
              </div>
            </div>

            {/* AI Advice */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold mb-3">Smart AI Tip</h4>
              <p className="text-gray-700 italic">{data.analytics.aiTip}</p>
              {data.analytics.reduceAdvice.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Money Saving Tips:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {data.analytics.reduceAdvice.map((advice: string, i: number) => (
                      <li key={i} className="text-sm text-gray-600">{advice}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Day-wise Expenditure */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Day-wise Expenditure</h3>
                <Line
                  data={getDayWiseData()}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { title: { display: true, text: "Day of Month" } },
                      y: { title: { display: true, text: "Expenditure (₹)" } },
                    },
                  }}
                  height={80}
                />
              </div>

              {/* Category Bar Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Category-wise Spending</h3>
                <Bar
                  data={getCategoryData()}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { title: { display: true, text: "Category" } },
                      y: { title: { display: true, text: "Amount (₹)" } },
                    },
                  }}
                  height={80}
                />
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Category Distribution</h3>
              <div className="max-w-md mx-auto">
                <Pie
                  data={getCategoryData()}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "bottom" } },
                  }}
                  height={80}
                />
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Categorized Transactions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.categorized.map((t: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{t.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{t.category}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">₹{t.amount}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
