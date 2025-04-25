import React from 'react';

const Alert = ({ message }) => {
  return (
    <div style={{ padding: '10px', backgroundColor: '#ffcccb', margin: '10px 0', border: '1px solid red' }}>
      <strong>Alert!</strong> {message}
    </div>
  );
};

export default Alert;
