// src/app/components/FeedbackForm.js
"use client";
import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          email: email,
          feedback: feedback
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setIsSent(true);
    } catch (error) {
      console.error('Email failed to send:', error);
      alert('Failed to send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <p className="text-green-600 text-center">
        Thank you for submitting your feedback! 📧
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Select email ID to send Feedback to</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* <div>
        <label className="block text-sm font-medium mb-1">Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          rows="4"
          className="w-full p-2 border rounded"
        />
      </div> */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Sending...' : 'Submit Feedback'}
      </button>
    </form>
  );
}