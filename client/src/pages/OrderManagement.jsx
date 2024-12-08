import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { orders } from '../utils/api';
import Table from '../components/common/Table';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';

const OrderHistory = () => {
  const [orderList, setOrderList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orders.getAll({ search: searchTerm, status: statusFilter });
      setOrderList(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: '_id', label: 'Order ID' },
    { 
      key: 'user', 
      label: 'Customer',
      render: (row) => row.user.username
    },
    { 
      key: 'restaurant', 
      label: 'Restaurant',
      render: (row) => row.restaurant.name
    },
    { 
      key: 'finalTotal', 
      label: 'Total',
      render: (row) => `$${row.finalTotal.toFixed(2)}`
    },
    { 
      key: 'orderStatus', 
      label: 'Status',
      render: (row) => <StatusBadge status={row.orderStatus} type="order" />
    },
    { 
      key: 'createdAt', 
      label: 'Order Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div>
          <button className="text-yellow-600 hover:text-yellow-900 mr-3">View</button>
          <button className="text-red-600 hover:text-red-900">Delete</button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search orders..."
          />

          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              className="border rounded-lg px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table
            columns={columns}
            data={orderList}
            onRowClick={(row) => console.log('Row clicked:', row)}
          />
        )}
      </div>
    </div>
  );
};

export default OrderHistory;