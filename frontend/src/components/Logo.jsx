// src/components/Logo.jsx
import React from 'react';
import logo from '../picture1.jpg'; // Make sure the path is correct

const Logo = () => {
  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <img src={logo} alt="Logo" width="100" />
    </div>
  );
};

export default Logo;
