
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col md:flex-row items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-3xl text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-expense-blue to-blue-600 bg-clip-text text-transparent">
            Simplify Your Financial Life
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            Upload your transaction data and get instant insights. ExpenseSnap categorizes your spending patterns automatically so you can make smarter financial decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            {user ? (
              <Button 
                size="lg" 
                className="bg-expense-blue hover:bg-blue-700 text-lg"
                onClick={() => navigate("/")}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-expense-blue hover:bg-blue-700 text-lg"
                  onClick={() => navigate("/auth?mode=login")}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-expense-blue text-expense-blue hover:bg-blue-50 text-lg"
                  onClick={() => navigate("/auth?mode=signup")}
                >
                  Create Account
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="hidden md:block w-full max-w-md">
          <img src="/placeholder.svg" alt="Expense Analysis" className="w-full h-auto rounded-xl shadow-lg" />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How ExpenseSnap Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-expense-gray p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-expense-blue rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Data</h3>
              <p className="text-gray-600">Simply upload your transaction CSV from any bank or financial institution.</p>
            </div>
            <div className="bg-expense-gray p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-expense-blue rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Categorization</h3>
              <p className="text-gray-600">Our system automatically categorizes your transactions for accurate insights.</p>
            </div>
            <div className="bg-expense-gray p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-expense-blue rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual Insights</h3>
              <p className="text-gray-600">Get meaningful charts and actionable insights to improve your finances.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial/Call to Action */}
      <section className="py-16 bg-gradient-to-br from-expense-blue to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Managing Your Finances Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already simplified their financial tracking with ExpenseSnap.
          </p>
          {!user && (
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-expense-blue hover:bg-blue-50 text-lg"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Create Free Account
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
