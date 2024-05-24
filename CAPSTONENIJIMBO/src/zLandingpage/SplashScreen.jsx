import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../zComponents/images/emsxcit.png';
import './splashScreen.css';

const AdminStudent = () => {
  return (
    <div className='AdminStudent__section'>
      <div className='AdminStudent__container'>
        <div>
        <p className='logo-text'>CIT - U EVENT MANAGEMENT SYSTEM</p>
          <img className='EMSlogo' src={Logo} alt="CIT-U NSTP Logo" />
        </div>
        <div className='AdminStudent__btn'>
          <Link to="/Student/Login">Login as Student</Link>
          <Link to="/Teacher/Login">Login as Teacher</Link>
        </div>
        <Link className='adminlink' to="/Admin/Login">Switch to Admin</Link>
      </div>
    </div>
  );
};

export default AdminStudent;
