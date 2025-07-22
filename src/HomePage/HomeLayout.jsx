import React from 'react';
import Navbar from '../Components/NavBar/Navbar';
import { Outlet } from 'react-router';

const HomeLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className=''>
                <Outlet></Outlet>
            </div>
            
        </div>
    );
};

export default HomeLayout;