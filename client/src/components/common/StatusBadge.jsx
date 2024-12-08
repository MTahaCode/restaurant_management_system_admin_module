import React from 'react';

const StatusBadge = ({ status, type }) => {
  const getStatusColor = () => {
    switch (type) {
      case 'user':
        return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      case 'order':
        switch (status.toLowerCase()) {
          case 'delivered': return 'bg-green-100 text-green-800';
          case 'cancelled': return 'bg-red-100 text-red-800';
          default: return 'bg-yellow-100 text-yellow-800';
        }
      case 'notification':
        switch (status.toLowerCase()) {
          case 'high': return 'bg-red-100 text-red-800';
          case 'medium': return 'bg-yellow-100 text-yellow-800';
          case 'low': return 'bg-green-100 text-green-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor()}`}>
      {status.toString()}
    </span>
  );
};

export default StatusBadge;