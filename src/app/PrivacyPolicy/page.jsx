"use client";

import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-black min-h-screen text-gray-300 px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-orange-500 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            At <span className="font-semibold text-orange-500">Apple Attires</span>, your privacy is our priority. 
            We are committed to protecting your personal data and providing a safe shopping experience.
          </p>
        </header>

        {/* Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-orange-500 border-l-4 border-orange-500 pl-3">
            Information We Collect
          </h2>
          <p className="text-gray-300 leading-relaxed">
            We collect various types of information to provide a smooth shopping experience:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Personal info: name, email, shipping address</li>
            <li>Financial info: credit card numbers, billing details</li>
            <li>Technical info: IP address, browsing data</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            We collect this information when you:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Place an order</li>
            <li>Create an account</li>
            <li>Contact support</li>
            <li>Subscribe to newsletters</li>
            <li>Use our website or app</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-orange-500 border-l-4 border-orange-500 pl-3">
            How We Use Your Information
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Your information helps us to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Process and fulfill orders efficiently</li>
            <li>Improve our website and services</li>
            <li>Send promotions and updates</li>
            <li>Respond to queries quickly</li>
            <li>Prevent fraud and security breaches</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            We never sell or trade your personal info without your consent, except as required by law.
          </p>
        </section>

        {/* Security */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-orange-500 border-l-4 border-orange-500 pl-3">
            How We Protect Your Information
          </h2>
          <p className="text-gray-300 leading-relaxed">
            We use industry-standard security measures to safeguard your data from unauthorized access and ensure your shopping experience is safe.
          </p>
        </section>

        {/* Your Rights */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-orange-500 border-l-4 border-orange-500 pl-3">
            Your Rights
          </h2>
          <p className="text-gray-300 leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Access and update your personal information</li>
            <li>Opt-out of marketing emails</li>
            <li>Request deletion of your data</li>
          </ul>
          <p className="text-gray-300 leading-relaxed">
            To exercise these rights, please contact us via the contact details on our website.
          </p>
        </section>

        {/* Updates */}
        <section className="space-y-4">
          <p className="text-gray-400 leading-relaxed text-center">
            We may update this privacy policy from time to time. We recommend reviewing it periodically to stay informed on how we protect your data.
          </p>
        </section>
      </div>
    </div>
  );
}
