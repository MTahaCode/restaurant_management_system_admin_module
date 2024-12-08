import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, ClipboardList, Bell, LogOut, ChefHat } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="bg-yellow-50 h-screen w-64 fixed left-0 top-0 shadow-lg">
      <div className="p-6 flex items-center space-x-2">
        <ChefHat className="w-8 h-8 text-yellow-600" />
        <h1 className="text-2xl font-bold text-yellow-800">Cheesious</h1>
      </div>
      
      <nav className="mt-6">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-yellow-100 transition-colors ${
              isActive ? 'bg-yellow-100 border-r-4 border-yellow-600' : ''
            }`
          }
        >
          <Users className="w-5 h-5 mr-3" />
          <span>User Management</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-yellow-100 transition-colors ${
              isActive ? 'bg-yellow-100 border-r-4 border-yellow-600' : ''
            }`
          }
        >
          <ClipboardList className="w-5 h-5 mr-3" />
          <span>Order History</span>
        </NavLink>

        <NavLink
          to="/admin/notifications"
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-yellow-100 transition-colors ${
              isActive ? 'bg-yellow-100 border-r-4 border-yellow-600' : ''
            }`
          }
        >
          <Bell className="w-5 h-5 mr-3" />
          <span>Notifications</span>
        </NavLink>
      </nav>

      <div className="absolute bottom-0 w-full p-6">
        <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;