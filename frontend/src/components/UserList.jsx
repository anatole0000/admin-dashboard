import React, { useEffect, useState } from 'react';
import api from '../api'; // Using the custom axios instance

const UserList = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from backend
  useEffect(() => {
    api.get('/users')
      .then((res) => setUsers(res.data)) // Use res.data to set users
      .catch((err) => console.log('Error fetching users:', err));
  }, []);

  // Delete a user
  const deleteUser = (id) => {
    api.delete(`/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user._id !== id)); // Remove user from list
      })
      .catch((err) => console.log('Error deleting user:', err));
  };

  return (
    <div>
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
