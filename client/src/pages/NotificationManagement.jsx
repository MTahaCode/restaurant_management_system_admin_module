import React, { useState, useEffect } from 'react';
import { Bell, Filter, Plus } from 'lucide-react';
import { notifications } from '../utils/api';
import Table from '../components/common/Table';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';

const NotificationManagement = () => {
  const [notificationList, setNotificationList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notifications.getAll({ search: searchTerm, priority: priorityFilter });
      setNotificationList(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'message', label: 'Message' },
    { 
      key: 'type', 
      label: 'Type',
      render: (row) => <span className="text-gray-600">{row.type}</span>
    },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (row) => <StatusBadge status={row.priority} type="notification" />
    },
    { 
      key: 'isRead', 
      label: 'Status',
      render: (row) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          row.isRead ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.isRead ? 'Read' : 'Unread'}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div>
          <button className="text-yellow-600 hover:text-yellow-900 mr-3">Edit</button>
          <button className="text-red-600 hover:text-red-900">Delete</button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notification Management</h1>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-yellow-700">
          <Plus className="w-5 h-5 mr-2" />
          Create Notification
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search notifications..."
          />

          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              className="border rounded-lg px-3 py-2"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table
            columns={columns}
            data={notificationList}
            onRowClick={(row) => console.log('Row clicked:', row)}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationManagement;