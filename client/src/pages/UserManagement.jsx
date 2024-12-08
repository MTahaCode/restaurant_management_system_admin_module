import React, { useState, useEffect } from 'react';
import { UserPlus, Filter } from 'lucide-react';
import { users } from '../utils/api';
import Table from '../components/common/Table';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import UserModal from '../components/modals/UserModal';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await users.getAll({ 
        search: searchTerm, 
        role: roleFilter !== 'all' ? roleFilter : undefined 
      });
      setUserList(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await users.create(userData);
      toast.success('User created successfully');
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await users.update(userId, userData);
      toast.success('User updated successfully');
      fetchUsers();
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await users.delete(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { 
      key: 'role', 
      label: 'Role',
      render: (row) => <StatusBadge status={row.role} type="role" />
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (row) => <StatusBadge status={row.isActive} type="user" />
    },
    { 
      key: 'lastLogin', 
      label: 'Last Login',
      render: (row) => row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : 'Never'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(row);
              setShowModal(true);
            }}
            className="text-yellow-600 hover:text-yellow-900 mr-3"
          >
            Edit
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(row._id);
            }}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      {localStorage.getItem("token")}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button 
          onClick={() => {
            setSelectedUser(null);
            setShowModal(true);
          }}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-yellow-700"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users..."
          />

          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              className="border rounded-lg px-3 py-2"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table
            columns={columns}
            data={userList}
            onRowClick={(row) => {
              setSelectedUser(row);
              setShowModal(true);
            }}
          />
        )}
      </div>

      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onSubmit={(formData) => {
            if (selectedUser) {
              handleUpdateUser(selectedUser._id, formData);
            } else {
              handleCreateUser(formData);
            }
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;