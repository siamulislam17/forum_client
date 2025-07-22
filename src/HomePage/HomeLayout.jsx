import React from 'react';
import Navbar from '../Components/NavBar/Navbar';
import { Outlet } from 'react-router';

const HomeLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='mt-20'>
                <Outlet></Outlet>
            </div>
            
        </div>
    );
};

export default HomeLayout;