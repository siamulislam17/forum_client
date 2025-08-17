import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Components/NavBar/Navbar';
import Banner from '../Pages/Banner/Banner';
import Tags from '../Pages/Tsgs/Tags';
import PostsList from '../Pages/AllPost/AllPost';
import Announcements from '../Pages/Announcements/Announcements';
import AboutSection from '../Pages/About/About';
import ContactSection from '../Pages/ContackHomePage/ContackHomePage';
import FAQ from '../Pages/Faqs/FAQs';
import MembershipPromo from '../Pages/BeAMember/BeAMember';
import { AuthContext } from '../Context/AuthContext';

const HomePage = () => {
    const { toggleDarkMode } = useContext(AuthContext);
    const containerBg = toggleDarkMode
        ? 'bg-gray-900 text-white'
        : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-900';

    const animationProps = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 },
    };

    return (
        <div className={`${containerBg}`}>
            <motion.div {...animationProps}><Banner /></motion.div>
            <div className='my-10 md:my-20'><motion.div {...animationProps}><Tags /></motion.div></div>
            <div className='my-10 md:my-20'><motion.div {...animationProps}><Announcements /></motion.div></div>
            <div className='my-10 md:my-20'><motion.div {...animationProps}><PostsList /></motion.div></div>
            <div className='my-10 md:my-20'><motion.div {...animationProps}><AboutSection /></motion.div></div>
            <div className='my-10 md:my-20'><motion.div {...animationProps}><FAQ /></motion.div></div>
            <div className='my-10 md:my-20'><motion.div {...animationProps}><MembershipPromo /></motion.div></div>
            <div className='mt-10'><motion.div {...animationProps}><ContactSection /></motion.div></div>
        </div>
    );
};

export default HomePage;
