import React from 'react';
import Navbar from '../Components/NavBar/Navbar';
import Banner from '../Pages/Banner/Banner';
import Tags from '../Pages/Tsgs/Tags';
import PostsList from '../Pages/AllPost/AllPost';
import Announcements from '../Pages/Announcements/Announcements';
import AboutSection from '../Pages/About/About';
import ContactSection from '../Pages/ContackHomePage/ContackHomePage';
import FAQ from '../Pages/Faqs/FAQs';



const HomePage = () => {
    return (
        <div className=''>
            <Banner></Banner>
            <Tags></Tags>
            <Announcements></Announcements>
            <PostsList></PostsList>
            <AboutSection></AboutSection>
            <FAQ></FAQ>
            <ContactSection></ContactSection>
        </div>
    );
};

export default HomePage;