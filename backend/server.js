const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const axios = require("axios");
const cors = require("cors");
// require("dotenv").config();
require("dotenv").config({ path: "./.env" });


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello Saurabh from server!' });
});

const uploadRoute = require('./routes/uploadRoute');
app.use('/api', uploadRoute);

const upload = multer({ dest: "uploads/" });

app.post("/analyze-transactions", upload.single("csvFile"), async (req, res) => {
  try {
    const csvFilePath = req.file.path;
    const transactions = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => {
          const description = row.Description || row.description || row["Transaction Description"];
          const amount = parseFloat(row.Amount || row.amount || row["Transaction Amount"] || 0);
          const date = row.Date || row.date || row["Transaction Date"] || "Unknown Date";
          const drcr = row["DR/CR"] || "DR";
          transactions.push({ description, amount: Math.abs(amount), date, drcr });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    fs.unlinkSync(csvFilePath);

    // Prepare prompt for Gemini
    const prompt = `Categorize the following transactions strictly into: Food, Travel, Shopping, Bills, Health, Groceries, Income.
Return JSON like:
[{ "description": "...", "category": "...", "amount": ..., "date": "..." }]
Data:
${transactions.map((t, i) => `${i + 1}. ${t.description} | Amount: ${t.amount} | Date: ${t.date}`).join("\n")}`;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }
    );

    const text = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const jsonText = text.substring(text.indexOf("["), text.lastIndexOf("]") + 1);
    const categorized = JSON.parse(jsonText);

    // === Custom Analytics ===
    const isCredit = (t) => t.drcr === "CR";
    const isDebit = (t) => t.drcr === "DR";

    const totalInflow = transactions.filter(isCredit).reduce((acc, t) => acc + t.amount, 0);
    const totalOutflow = transactions.filter(isDebit).reduce((acc, t) => acc + t.amount, 0);

    // Unique merchants = one-time expenses
    const merchantCounts = {};
    transactions.forEach((t) => {
      const name = t.description;
      merchantCounts[name] = (merchantCounts[name] || 0) + 1;
    });
    const oneTimeExpenses = transactions.filter((t) => merchantCounts[t.description] === 1 && t.drcr === "DR");

    // Bill Calendar (using keywords)
    const billCalendar = transactions
      .filter((t) => /electricity|mobile|netflix|bill/i.test(t.description))
      .map((t) => ({ description: t.description, date: t.date }));

    // Expense Reduction Advice
    const categoryTotals = {};
    categorized.forEach((t) => {
      if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
      categoryTotals[t.category] += t.amount;
    });
    const reduceAdvice = Object.entries(categoryTotals)
      .filter(([cat, amt]) => amt > 1000 && cat !== "Income")
      .map(([cat, amt]) => `Try reducing ${cat} spend of ₹${amt.toFixed(0)} to ₹${(amt * 0.7).toFixed(0)}.`);

    // Half month comparison
    const firstHalf = transactions.filter((t) => parseInt(t.date.split("-")[2]) <= 15 && t.drcr === "DR");
    const secondHalf = transactions.filter((t) => parseInt(t.date.split("-")[2]) > 15 && t.drcr === "DR");
    const firstTotal = firstHalf.reduce((acc, t) => acc + t.amount, 0);
    const secondTotal = secondHalf.reduce((acc, t) => acc + t.amount, 0);

    // Cash crunch (balance drops)
    const cashCrunch = transactions.some((t) => parseFloat(t.Balance || 10000) < 1000);

    // Financial Health Score (simple metric)
    let score = 100;
    if (totalOutflow > totalInflow) score -= 20;
    if (cashCrunch) score -= 15;
    if (reduceAdvice.length >= 3) score -= 10;

    // "If you saved this" sim (top 3 spends)
    const topSpends = transactions
      .filter(isDebit)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
      .map((t) => t.amount);
    const savedTotal = topSpends.reduce((a, b) => a + b, 0);
    const simulatedAmount = (savedTotal * 1.07).toFixed(2); // 7% interest

    // AI Suggestion
    const advicePrompt = `Based on this data: inflow ₹${totalInflow}, outflow ₹${totalOutflow}, top categories: ${Object.keys(categoryTotals).join(", ")}. Suggest 1 smart tip.`;
    const tipRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: advicePrompt }] }],
      }
    );
    const aiTip = tipRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "Spend wisely!";

    // === Final Response ===
    res.json({
      categorized,
      analytics: {
        totalInflow,
        totalOutflow,
        oneTimeExpenses,
        billCalendar,
        reduceAdvice,
        halfMonthComparison: { firstHalf: firstTotal, secondHalf: secondTotal },
        cashCrunch,
        financialHealthScore: score,
        ifSavedTop3: {
          saved: savedTotal.toFixed(2),
          afterInterest: simulatedAmount,
        },
        aiTip,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error.message);
    res.status(500).json({ error: "Failed to analyze transactions" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
