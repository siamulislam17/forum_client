import { useNavigate } from 'react-router';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const ContactSection = () => {
  const navigate = useNavigate();
  const { toggleDarkMode } = useContext(AuthContext);
      const containerBg = toggleDarkMode
          ? 'bg-gray-900 text-white'
          : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-900';

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, label: 'Location', value: 'Dhaka, Bangladesh' },
    { icon: <FaPhone />, label: 'Phone', value: '+8801765083584' },
    { icon: <FaWhatsapp />, label: 'WhatsApp', value: 'Chat on WhatsApp', link: 'https://wa.me/8801765083584' },
    { icon: <FaEnvelope />, label: 'Email', value: 'siamthca@gmail.com', link: 'mailto:siamthca@gmail.com' },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, name: 'Facebook', link: 'https://www.facebook.com/siam.ul.islam.428705' },
    { icon: <FaGithub />, name: 'GitHub', link: 'https://github.com/siamulislam17' },
    { icon: <FaLinkedin />, name: 'LinkedIn', link: 'https://www.linkedin.com/in/siam-ul-islam-siam' },
  ];

  return (
    <div className={` px-6 pb-20 transition-colors duration-500 ${containerBg}`}>
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
        Get in Touch
      </h2>
      <p className="text-center mb-12 max-w-2xl mx-auto text-lg">
        Have questions, feedback, or ideas? We'd love to hear from you! Reach us via any of the methods below or send a direct message.
      </p>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Contact Cards */}
        {contactInfo.map((info, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 ${
              toggleDarkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow-purple-200'
            }`}
          >
            <div className="text-3xl text-purple-600">{info.icon}</div>
            <div>
              <h4 className="font-semibold">{info.label}</h4>
              {info.link ? (
                <a href={info.link} target="_blank" rel="noreferrer" className="hover:underline">
                  {info.value}
                </a>
              ) : (
                <span>{info.value}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Send Message Button */}
      <div className="text-center mt-16">
        <button
          onClick={() => navigate('/contact-google-form')}
          className="bg-purple-600 hover:bg-purple-700 text-white  py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
        >
          Send a Message
        </button>
      </div>

      {/* Social Links */}
      <div className="mt-16 text-center space-x-6">
        {socialLinks.map((social, i) => (
          <a
            key={i}
            href={social.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white/20 dark:bg-white/10 px-4 py-2 rounded-full hover:bg-purple-600 hover:text-white transition-colors"
          >
            <span className="text-xl">{social.icon}</span>
            <span className="font-medium">{social.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ContactSection;
