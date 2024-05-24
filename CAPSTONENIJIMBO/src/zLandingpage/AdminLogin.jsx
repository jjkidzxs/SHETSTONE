import React, { useState} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Ems from '../zComponents/images/emsxcit.png'
import './LoginSignup.css';
const AdminLogin = () => {
  const [adminID, setAdminID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate =useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.get('http://localhost:8080/getByUseridAdmin', {
        params: { adminID, password },
      });


      const user = response.data;

      console.log('Login successful', user);
      navigate(`/Admin/Dashboard/${user.adminID}`);

    } catch (error) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error', error);
    }
  };

  return (
    <div>
      <div class="splitL leftL">
  <div class="centeredL">
  <div className="forms-container">
        <div className="signin">
          <form action="#" className="sign-in-form" onSubmit={handleLogin}>
            <h2 className="title">Log in</h2>
            
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                value={adminID}
                placeholder="Admin ID no."
                onChange={(e) => setAdminID(e.target.value)}
              />
            </div>
            
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btnL">Login</button>
          </form>
          
          
        </div>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
  </div>
</div>

<div class="split rightL">
  <div class="centeredL">
  <img src={Ems} alt="logo" />
  </div>
</div>
    </div>
  );
}

export default AdminLogin