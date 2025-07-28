import React, { useContext } from 'react';
import Navbar from '../Components/NavBar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer/Footer';
import { AuthContext } from '../Context/AuthContext';

const HomeLayout = () => {
    const { toggleDarkMode } = useContext(AuthContext);
    return (
        <div className={`${toggleDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <Navbar></Navbar>
          
                <Outlet></Outlet>
            
            <Footer></Footer>
        </div>
    );
};

export default HomeLayout;