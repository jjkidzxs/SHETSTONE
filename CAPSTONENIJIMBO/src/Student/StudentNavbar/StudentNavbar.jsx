import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Ems from '../../zComponents/images/emsxcit.png'; // Correct the path here
import './studentNavbar.css';

const StudentNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const studentID = location.pathname.split('/')[3];

  return (
    <nav className='Snav'>
      <Link to={`/Student/Homepage/${studentID}`} className='nav__logo'>
        <img src={Ems} alt='Navbar Logo' />
        <span className='nav__text'>EVENT MANAGEMENT SYSTEM</span>
      </Link>
      <div className='menu' onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? 'open' : ''}>
        <li>
          <NavLink to={`/Student/Events/${studentID}`}>Events</NavLink>
        </li>
        <li>
          <NavLink to={`/Student/Articles/${studentID}`}>Articles</NavLink>
        </li>
        <li>
          <NavLink to={`/Student/FaQs/${studentID}`}>About Us</NavLink>
        </li>
        <li>
          <NavLink to={`/Student/Profile/${studentID}`}>{studentID}</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default StudentNavbar;
