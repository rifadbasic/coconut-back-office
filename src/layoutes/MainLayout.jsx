import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/navbar/Navbar.jsx';
import Footer from '../components/footer/Footer.jsx';

const MainLayout = () => {
  return (
    <>

      <Navbar />
      <Outlet />
      <Footer />
      
      
    </>
  );
};

export default MainLayout;