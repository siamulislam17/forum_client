import React from 'react';
import Navbar from '../Components/NavBar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer/Footer';

const HomeLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className=''>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default HomeLayout;