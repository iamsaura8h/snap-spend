import React, { useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Button, Input, Card, Spinner } from "@components/ui"; 


interface Transaction {
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function Saurabh() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("csvFile", file);
    setLoading(true);
    try {
      const res = await axios.post("/analyze-transactions", formData);
      setData(res.data);
    } catch (err) {
      alert("Error analyzing CSV");
      console.error(err);
    }
    setLoading(false);
  };

  // Income vs. Expense Chart (Bar Chart)
  const incomeExpenseData = [
    { month: "January", income: 10000, expenses: 8000 },
    { month: "February", income: 12000, expenses: 10000 },
    { month: "March", income: 14000, expenses: 9000 },
    { month: "April", income: 16000, expenses: 11000 },
  ];

  // Expense Breakdown by Category (Pie Chart)
  const expenseData = [
    { name: "Food", value: 3000 },
    { name: "Rent", value: 5000 },
    { name: "Transport", value: 2000 },
    { name: "Entertainment", value: 1000 },
  ];

  // Monthly Savings Trend (Line Chart)
  const savingsData = [
    { month: "January", savings: 2000 },
    { month: "February", savings: 3000 },
    { month: "March", savings: 4000 },
    { month: "April", savings: 5000 },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">💰 Saurabh's Finance Buddy</h1>

      {/* File Upload Section */}
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full max-w-xs"
        />
        <Button
          onClick={handleUpload}
          isLoading={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </Button>
      </div>

      {/* Displaying Data and Graphs */}
      {data && (
        <div className="space-y-8">
          {/* Categorized Table */}
          <Card className="shadow-lg bg-white p-4">
            <h2 className="text-xl font-semibold">📊 Categorized Transactions</h2>
            <div className="overflow-auto">
              <table className="table-auto w-full text-sm border mt-2">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categorized.map((t: Transaction, i: number) => (
                    <tr key={i} className="border-b">
                      <td className="p-2 border">{t.date}</td>
                      <td className="p-2 border">{t.description}</td>
                      <td className="p-2 border">₹{t.amount}</td>
                      <td className="p-2 border">{t.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income vs Expenses Chart */}
            <Card className="shadow-lg p-6 bg-white">
              <h2 className="text-xl font-semibold">Income vs. Expenses</h2>
              <BarChart width={500} height={300} data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#007bff" />
                <Bar dataKey="expenses" fill="#dc3545" />
              </BarChart>
            </Card>

            {/* Expense Breakdown by Category */}
            <Card className="shadow-lg p-6 bg-white">
              <h2 className="text-xl font-semibold">Expense Breakdown by Category</h2>
              <PieChart width={400} height={400}>
                <Pie
                  data={expenseData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={150}
                  fill="#82ca9d"
                  label
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#ffb3b3" : "#66b3ff"} />
                  ))}
                </Pie>
              </PieChart>
            </Card>

            {/* Monthly Savings Trend */}
            <Card className="shadow-lg p-6 bg-white">
              <h2 className="text-xl font-semibold">Monthly Savings Trend</h2>
              <LineChart width={500} height={300} data={savingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="savings" stroke="#28a745" />
              </LineChart>
            </Card>
          </div>

          {/* Additional Insights */}
          <div className="space-y-4">
            <Card className="shadow-lg p-6 bg-white">
              <h2 className="text-xl font-semibold">💡 Key Insights</h2>
              <ul className="list-disc pl-6">
                <li><strong>Expense vs Income Trends:</strong> The comparison between monthly income and expenses shows a clear pattern in financial behavior. There's a noticeable gap between income and expenses in March and April, suggesting a higher savings rate.</li>
                <li><strong>Expense Breakdown:</strong> The highest proportion of your expenses is spent on rent, followed by food. This suggests that these are key areas to review for potential savings.</li>
                <li><strong>Savings Growth:</strong> Your monthly savings trend shows a consistent increase, which is a positive indicator of your financial health.</li>
                <li><strong>Budget Adjustments:</strong> Based on this data, you could consider allocating a larger portion of income to savings or investments as income grows.</li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-6">
          <Spinner />
        </div>
      )}
    </div>
  );
}
