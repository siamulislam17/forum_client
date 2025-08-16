// src/Components/Terms/Terms.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const Terms = () => {
  const { toggleDarkMode } = useContext(AuthContext);

  const containerBg = toggleDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-900';

  const sectionText = toggleDarkMode ? 'text-gray-300' : 'text-gray-800';
  const sectionBg = toggleDarkMode ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`${containerBg} min-h-screen px-6 py-16 transition-all duration-500`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Fancy Gradient Title */}
        <h1 className="text-3xl mt-9 font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600">
          Terms & Conditions
        </h1>

        {/* Subtitle */}
        <p className={`text-center text-lg ${sectionText}`}>
          Please read these terms carefully before using our social forum.
        </p>

        {/* Terms Sections */}
        <div className="space-y-6">
          {[
            {
              title: '1. User Conduct',
              content: 'Users must behave respectfully and avoid posting offensive, harmful, or illegal content. Harassment or discrimination will not be tolerated.'
            },
            {
              title: '2. Account Responsibility',
              content: 'Each user is responsible for maintaining the confidentiality of their account information and for all activities conducted under their account.'
            },
            {
              title: '3. Content Ownership',
              content: 'Users retain ownership of their content, but grant the platform a license to display, share, and distribute posts within the forum.'
            },
            {
              title: '4. Privacy',
              content: 'We respect your privacy. Please review our Privacy Policy to understand how we collect, use, and protect your personal data.'
            },
            {
              title: '5. Limitation of Liability',
              content: 'We are not responsible for any damages or losses resulting from the use of the website or reliance on content posted by users.'
            },
            {
              title: '6. Changes to Terms',
              content: 'We reserve the right to modify these terms at any time. Continued use of the site implies acceptance of the updated terms.'
            }
          ].map((section, idx) => (
            <div key={idx} className={`${sectionBg} p-6 rounded-xl shadow-md transition-all duration-300`}>
              <h2 className="text-2xl font-semibold mb-2 text-purple-600 dark:text-purple-400">
                {section.title}
              </h2>
              <p className={sectionText}>{section.content}</p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p className={`text-center mt-8 ${sectionText}`}>
          By using our platform, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
        </p>
      </div>
    </div>
  );
};

export default Terms;
