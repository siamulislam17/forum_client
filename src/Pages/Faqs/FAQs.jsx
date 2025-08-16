import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const FAQ = () => {
  const { toggleDarkMode } = useContext(AuthContext);

  const containerBg = toggleDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-900';

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click on the "Sign Up" button at the top, fill out the form, and submit. You can also sign up using Google.',
    },
    {
      question: 'Can I post anonymously?',
      answer: 'No, all posts require a registered account to maintain community standards and accountability.',
    },
    {
      question: 'How can I report inappropriate content?',
      answer: 'Each post and comment has a "Report" button. Click it and follow the instructions to notify our moderators.',
    },
    {
      question: 'Is there a membership feature?',
      answer: 'Yes, some features are limited to members. You can become a member via the dashboard or during signup.',
    },
    {
      question: 'Can I reset my password?',
      answer: 'Yes, click "Forgot Password" on the login page and follow the instructions to reset your password.',
    },
  ];

  return (
    <div className={`w-full mx-auto p-6  ${containerBg} py-10`}>
      <h2 className="text-3xl font-bold mb-6 text-center ext-gradient bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">Frequently Asked Questions</h2>

      <div className="max-w-4xl mx-auto space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="collapse collapse-arrow border border-gray-200 rounded-box transition-colors duration-300">
            <input type="checkbox" className="peer" />
            <div className={`collapse-title text-lg font-medium ${toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              {faq.question}
            </div>
            <div className={`collapse-content ${toggleDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
