"use client";
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { FaPaperPlane, FaEnvelope, FaStar } from 'react-icons/fa';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function FeedbackForm() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    rating: 0,
    feedback: '',
    suggestions: '',
    experience: 'good',
    wouldRecommend: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!user) {
      setError('Please log in to submit feedback');
      setIsSubmitting(false);
      return;
    }

    try {
      // Log the data being sent
      console.log('Sending feedback with data:', {
        to_email: process.env.NEXT_PUBLIC_CREATOR_EMAIL,
        from_email: user.email,
        user_name: user.displayName || 'User',
        rating: formData.rating,
        feedback: formData.feedback,
        suggestions: formData.suggestions,
        experience: formData.experience,
        would_recommend: formData.wouldRecommend ? 'Yes' : 'No'
      });

      // Send feedback to creator
      const feedbackResponse = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          to_email: process.env.NEXT_PUBLIC_CREATOR_EMAIL,
          from_email: user.email,
          user_name: user.displayName || 'User',
          rating: formData.rating,
          feedback: formData.feedback,
          suggestions: formData.suggestions,
          experience: formData.experience,
          would_recommend: formData.wouldRecommend ? 'Yes' : 'No'
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      console.log('Feedback email response:', feedbackResponse);

      if (!user?.email) {
        console.error('User email is missing. Cannot send thank you email.');
        return;
      }

      // Send thank you email to user
      const thankYouResponse = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_THANK_YOU_TEMPLATE_ID,
        {
          to_email: user.email,
          from_email: process.env.NEXT_PUBLIC_CREATOR_EMAIL,
          user_name: user.displayName || 'User',
          creator_name: process.env.NEXT_PUBLIC_CREATOR_NAME || 'Creator'
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      console.log('Thank you email response:', thankYouResponse);

      setIsSent(true);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(`Failed to send feedback: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-3 text-green-600">
          <FaEnvelope className="h-8 w-8" />
          <p className="font-medium text-lg">Thank you for your feedback!</p>
          <p className="text-sm">A confirmation email has been sent to your inbox.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            How would you rate your experience?
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              >
                <FaStar
                  className={`h-6 w-6 ${
                    star <= (hoveredRating || formData.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Your Feedback
          </label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleInputChange}
            required
            rows="4"
            placeholder="Share your thoughts about the experience..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-400"
          />
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Suggestions for Improvement
          </label>
          <textarea
            name="suggestions"
            value={formData.suggestions}
            onChange={handleInputChange}
            rows="3"
            placeholder="Any suggestions to make it better?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-400"
          />
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            How was your overall experience?
          </label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black placeholder-gray-400"
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        {/* Would Recommend */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="wouldRecommend"
            checked={formData.wouldRecommend}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">
            Would you recommend this to others?
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2
          ${isSubmitting ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
          "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"}`}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Sending...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <FaPaperPlane className="h-4 w-4" />
            <span>Submit Feedback</span>
          </div>
        )}
      </button>
    </form>
  );
} 