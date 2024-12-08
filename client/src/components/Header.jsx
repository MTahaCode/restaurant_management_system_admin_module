import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white h-16 fixed top-0 right-0 left-64 shadow-sm z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="text-lg font-semibold text-gray-800">
          Welcome back, Admin
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-yellow-800" />
            </div>
            <span className="text-sm font-medium text-gray-700">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;