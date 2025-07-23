import React from 'react';
import Navbar from '../Components/NavBar/Navbar';
import Banner from '../Pages/Banner/Banner';
import Tags from '../Pages/Tsgs/Tags';
import PostsList from '../Pages/AllPost/AllPost';


const HomePage = () => {
    return (
        <div className='mt-20'>
            <Banner></Banner>
            <Tags></Tags>
            <PostsList></PostsList>
        </div>
    );
};

export default HomePage;