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

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef();

  // Handle CSV upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("csvFile", file);
    try {
      const res = await fetch("http://localhost:5000/analyze-transactions", {
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
    // Aggregate debit transactions by day (assuming date is YYYY-MM-DD)
    const dayMap = {};
    data.categorized.forEach((t) => {
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
    const catTotals = {};
    data.categorized.forEach((t) => {
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
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Transaction Analyzer</h2>
      <div style={{ textAlign: "center", margin: 20 }}>
        <input
          type="file"
          accept=".csv"
          ref={fileInput}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInput.current.click()}
          disabled={loading}
          style={{
            padding: "10px 24px",
            fontSize: "16px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
        <div><a href="/sau2"><button className="bg-purple-400 h-10 w-16 mr-6">Chatbot</button></a></div>
      </div>
      {data && (
        <div>
          {/* Key Insights */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "space-between",
            marginBottom: 24
          }}>
            <div style={{
              flex: 1,
              minWidth: 200,
              background: "#f5f5f5",
              borderRadius: 8,
              padding: 16
            }}>
              <h4>Total Inflow</h4>
              <div style={{ fontSize: 22, color: "#388e3c" }}>₹{data.analytics.totalInflow}</div>
            </div>
            <div style={{
              flex: 1,
              minWidth: 200,
              background: "#f5f5f5",
              borderRadius: 8,
              padding: 16
            }}>
              <h4>Total Outflow</h4>
              <div style={{ fontSize: 22, color: "#d32f2f" }}>₹{data.analytics.totalOutflow}</div>
            </div>
            <div style={{
              flex: 2,
              minWidth: 250,
              background: "#f5f5f5",
              borderRadius: 8,
              padding: 16
            }}>
              <h4>Reduce Advice</h4>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {data.analytics.reduceAdvice.length
                  ? data.analytics.reduceAdvice.map((advice, i) => <li key={i}>{advice}</li>)
                  : <li>No advice</li>}
              </ul>
            </div>
            <div style={{
              flex: 1,
              minWidth: 200,
              background: "#f5f5f5",
              borderRadius: 8,
              padding: 16
            }}>
              <h4>Smart AI Tip</h4>
              <div style={{ fontStyle: "italic" }}>{data.analytics.aiTip}</div>
            </div>
          </div>

          {/* Day-wise Expenditure (Line Chart) */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ textAlign: "center" }}>Day-wise Expenditure</h3>
            <Line
              data={getDayWiseData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  x: { title: { display: true, text: "Day of Month" } },
                  y: { title: { display: true, text: "Expenditure (₹)" } },
                },
              }}
              height={80}
            />
          </div>

          {/* Category-wise Spending (Bar Chart) */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ textAlign: "center" }}>Amount Spent in Each Category</h3>
            <Bar
              data={getCategoryData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                scales: {
                  x: { title: { display: true, text: "Category" } },
                  y: { title: { display: true, text: "Amount (₹)" } },
                },
              }}
              height={80}
            />
          </div>

          {/* Category-wise Spending (Pie Chart) */}
          <div style={{ marginBottom: 36, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
            <h3 style={{ textAlign: "center" }}>Category-wise Spending (Pie Chart)</h3>
            <Pie
              data={getCategoryData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: "bottom" },
                  title: { display: false },
                },
              }}
              height={80}
            />
          </div>

          {/* First vs Second Half Textual */}
          <div style={{
            background: "#f0f0f0",
            borderRadius: 8,
            padding: 16,
            marginBottom: 36,
            textAlign: "center"
          }}>
            <h4>First vs Second Half of Month</h4>
            <div style={{ fontSize: 18 }}>
              <b>First Half (Days 1–15):</b> ₹{data.analytics.halfMonthComparison.firstHalf}
              <br />
              <b>Second Half (Days 16–31):</b> ₹{data.analytics.halfMonthComparison.secondHalf}
            </div>
          </div>

          {/* Categorized Transactions Table */}
          <div style={{ marginTop: 40 }}>
            <h3>Categorized Transactions</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                borderCollapse: "collapse",
                width: "100%",
                background: "#fff"
              }}>
                <thead>
                  <tr style={{ background: "#e3e3e3" }}>
                    <th style={{ padding: 8, border: "1px solid #ccc" }}>Description</th>
                    <th style={{ padding: 8, border: "1px solid #ccc" }}>Category</th>
                    <th style={{ padding: 8, border: "1px solid #ccc" }}>Amount</th>
                    <th style={{ padding: 8, border: "1px solid #ccc" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categorized.map((t, i) => (
                    <tr key={i}>
                      <td style={{ padding: 8, border: "1px solid #eee" }}>{t.description}</td>
                      <td style={{ padding: 8, border: "1px solid #eee" }}>{t.category}</td>
                      <td style={{ padding: 8, border: "1px solid #eee" }}>₹{t.amount}</td>
                      <td style={{ padding: 8, border: "1px solid #eee" }}>{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
