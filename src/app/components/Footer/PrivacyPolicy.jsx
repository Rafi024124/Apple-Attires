'use client';

import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Privacy Policy
      </h1>

      <p className="mb-6 text-gray-700">
        Thank you for visiting our e-commerce website. We are committed to protecting your privacy
        and the security of the personal information that you provide to us. This privacy policy
        explains how we collect, use, and share your information.
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">Information We Collect</h2>
        <p className="mb-3 text-gray-700">
          We collect various types of information from users of our website, including:
        </p>
        <ul className="list-disc list-inside mb-3 text-gray-700">
          <li>Personal information, such as your name, email address, and shipping address</li>
          <li>Financial information, such as credit card numbers and billing addresses</li>
          <li>Other information, such as your IP address and browsing history</li>
        </ul>
        <p className="mb-3 text-gray-700">We collect this information when you:</p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Place an order on our website</li>
          <li>Create an account on our website</li>
          <li>Contact us with a question or comment</li>
          <li>Sign up for our newsletter or other promotional emails</li>
          <li>Use our website or mobile app</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">How We Use Your Information</h2>
        <p className="mb-3 text-gray-700">
          We use the information that we collect to:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Process and fulfill your orders</li>
          <li>Improve our website and customer service</li>
          <li>Send you promotional emails and other marketing materials</li>
          <li>Respond to your questions and comments</li>
          <li>Detect and prevent fraud and other illegal activities</li>
        </ul>
        <p className="mt-3 text-gray-700">
          We do not sell, trade, or otherwise transfer your personal information to outside parties
          without your consent, except as required by law.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">How We Protect Your Information</h2>
        <p className="text-gray-700">
          We take the security of your personal information seriously and take reasonable steps to
          protect it. We use industry-standard security measures to protect your information from
          unauthorized access, disclosure, and use.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">Your Rights</h2>
        <p className="mb-3 text-gray-700">You have the right to:</p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Access and correct your personal information</li>
          <li>Opt-out of receiving promotional emails and other marketing materials</li>
          <li>Request that we delete your personal information</li>
        </ul>
        <p className="mt-3 text-gray-700">
          To exercise these rights, please contact us using the contact information provided on our
          website.
        </p>
      </section>

      <section>
        <p className="text-gray-700">
          We may update this privacy policy from time to time by posting a new version on our website.
          We encourage you to review this privacy policy periodically to stay informed about how we
          are protecting your personal information.
        </p>
      </section>
    </div>
  );
}
