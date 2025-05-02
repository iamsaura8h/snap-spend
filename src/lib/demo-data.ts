
import { CategoryTotal, MonthlySpending, Transaction } from "./types";

export const recentTransactions: Transaction[] = [
  {
    id: "tx1",
    date: "2023-05-01",
    description: "Grocery Shopping",
    amount: 85.42,
    category: "Food",
  },
  {
    id: "tx2",
    date: "2023-05-03",
    description: "Uber Ride",
    amount: 24.99,
    category: "Travel",
  },
  {
    id: "tx3",
    date: "2023-05-05",
    description: "Netflix Subscription",
    amount: 15.99,
    category: "Entertainment",
  },
  {
    id: "tx4",
    date: "2023-05-07",
    description: "Electricity Bill",
    amount: 112.45,
    category: "Bills",
  },
  {
    id: "tx5",
    date: "2023-05-10",
    description: "Amazon Purchase",
    amount: 49.99,
    category: "Shopping",
  },
  {
    id: "tx6",
    date: "2023-05-12",
    description: "Restaurant Dinner",
    amount: 78.35,
    category: "Food",
  },
];

export const categoryTotals: CategoryTotal[] = [
  {
    category: "Food",
    total: 458.77,
    percentage: 30,
    color: "#ef4444", // red-500
  },
  {
    category: "Travel",
    total: 245.30,
    percentage: 16,
    color: "#3b82f6", // blue-500
  },
  {
    category: "Bills",
    total: 325.45,
    percentage: 21,
    color: "#f59e0b", // amber-500
  },
  {
    category: "Shopping",
    total: 189.99,
    percentage: 12,
    color: "#a855f7", // purple-500
  },
  {
    category: "Entertainment",
    total: 156.49,
    percentage: 10,
    color: "#22c55e", // green-500
  },
  {
    category: "Other",
    total: 175.25,
    percentage: 11,
    color: "#6b7280", // gray-500
  },
];

export const monthlySpending: MonthlySpending[] = [
  {
    month: "Jan",
    Food: 420.50,
    Travel: 200.30,
    Bills: 305.45,
    Shopping: 150.99,
    Entertainment: 130.49,
    Other: 160.25,
  },
  {
    month: "Feb",
    Food: 385.20,
    Travel: 180.75,
    Bills: 320.45,
    Shopping: 175.99,
    Entertainment: 145.49,
    Other: 145.85,
  },
  {
    month: "Mar",
    Food: 410.80,
    Travel: 210.30,
    Bills: 315.45,
    Shopping: 200.99,
    Entertainment: 160.49,
    Other: 170.25,
  },
  {
    month: "Apr",
    Food: 435.30,
    Travel: 230.80,
    Bills: 310.45,
    Shopping: 180.99,
    Entertainment: 150.49,
    Other: 165.25,
  },
  {
    month: "May",
    Food: 458.77,
    Travel: 245.30,
    Bills: 325.45,
    Shopping: 189.99,
    Entertainment: 156.49,
    Other: 175.25,
  },
];

export const getCategoryColor = (category: string): string => {
  const matchedCategory = categoryTotals.find((c) => c.category === category);
  return matchedCategory ? matchedCategory.color : "#6b7280"; // Default to gray
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
};
