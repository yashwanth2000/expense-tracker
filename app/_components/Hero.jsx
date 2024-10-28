import React from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

function Hero() {
  const features = [
    {
      icon: "📊",
      title: "Expense Tracking",
      description:
        "Track all your expenses in one place with easy-to-use interface.",
    },
    {
      icon: "💰",
      title: "Budget Planning",
      description: "Create and manage budgets to keep your spending in check.",
    },
    {
      icon: "📈",
      title: "Reports & Analytics",
      description: "Get detailed insights about your spending patterns.",
    },
  ];

  const steps = [
    {
      title: "Create Account",
      description: "Sign up for free and set up your profile in minutes.",
    },
    {
      title: "Add Expenses",
      description: "Start adding your daily expenses and categorize them.",
    },
    {
      title: "Track Progress",
      description:
        "Monitor your spending habits and achieve your financial goals.",
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
          <div className={`mx-auto max-w-xl text-center ${poppins.className}`}>
            <h1 className="text-3xl font-extrabold sm:text-5xl animate-fade-in-up">
              Manage Your Expense
              <strong className="font-extrabold text-indigo-600 dark:text-indigo-400 sm:block pt-3">
                Control Your Money.
              </strong>
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-300 sm:text-xl animate-fade-in-up delay-200">
              Start Creating your budget and keep track of your expenses.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in-up delay-300">
              <Link
                className="group relative inline-flex items-center overflow-hidden rounded-full bg-blue-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-blue-600"
                href="/sign-up"
              >
                <span className="absolute -end-full transition-all group-hover:end-4">
                  →
                </span>
                <span className="text-sm font-medium transition-all group-hover:me-4">
                  Get Started
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50/50 dark:bg-gray-900/50 py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2
            className={`text-3xl font-bold text-center mb-12 ${poppins.className} text-gray-900 dark:text-white`}
          >
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
                rounded-2xl shadow-xl hover:shadow-2xl dark:shadow-gray-900/30
                border border-gray-100 dark:border-gray-700
                transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2
            className={`text-3xl font-bold text-center mb-12 ${poppins.className} text-gray-900 dark:text-white`}
          >
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div
                  className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 
                  dark:from-indigo-600 dark:to-indigo-700
                  rounded-2xl flex items-center justify-center text-white text-xl 
                  font-bold mx-auto mb-4 shadow-lg group-hover:shadow-indigo-500/25
                  transform group-hover:scale-110 transition-all duration-300"
                >
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10"></div>
        <div className="relative max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p
              className={`text-sm ${poppins.className} text-gray-600 dark:text-gray-400`}
            >
              &copy; {new Date().getFullYear()} Expense Tracker. All rights
              reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
              Built with <span className="text-red-500 animate-pulse">❤️</span>{" "}
              using
              <a href="https://nextjs.org/" target="_blank" className="text-indigo-600 dark:text-indigo-400">
                Next.js
              </a>{" "}
              and
              <a href="https://reactjs.org/" target="_blank" className="text-indigo-600 dark:text-indigo-400">
                React
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Hero;
