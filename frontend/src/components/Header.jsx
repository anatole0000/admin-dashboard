// src/components/Header.jsx
import React from 'react';
import Logo from './Logo';

const Header = () => {
  return (
    <header style={{ padding: '20px', background: '#282c34', color: 'white', textAlign: 'center' }}>
      <Logo />
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ display: 'inline', margin: '0 10px' }}>
            <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
          </li>
          <li style={{ display: 'inline', margin: '0 10px' }}>
            <a href="/about" style={{ color: 'white', textDecoration: 'none' }}>About</a>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
