import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shirt,
  Tags,
  Repeat,
  Truck,
  AlertTriangle,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { currentUser } from '../data/mockData';
const navItems = [
{
  path: '/admin/dashboard',
  icon: LayoutDashboard,
  label: 'Dashboard'
},
{
  path: '/admin/users',
  icon: Users,
  label: 'Users'
},
{
  path: '/admin/clothes',
  icon: Shirt,
  label: 'Clothes'
},
{
  path: '/admin/categories',
  icon: Tags,
  label: 'Categories'
},
{
  path: '/admin/swaps',
  icon: Repeat,
  label: 'Swaps'
},
{
  path: '/admin/exchange',
  icon: Truck,
  label: 'Exchange'
},
{
  path: '/admin/complaints',
  icon: AlertTriangle,
  label: 'Complaints'
},
{
  path: '/admin/feedback',
  icon: Star,
  label: 'Feedback'
},
{
  path: '/admin/settings',
  icon: Settings,
  label: 'Settings'
}];

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentTitle =
  navItems.find((item) => item.path === location.pathname)?.label ||
  'Admin Portal';
  const handleLogout = () => {
    navigate('/admin/login');
  };
  return (
    <div className="flex h-screen bg-warmGray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 bg-warmGray-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)} />

        }
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-warmGray-900 text-warmGray-300 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-serif font-bold text-xl">
              C
            </div>
            <span className="font-serif font-bold text-xl text-white">
              ClothSwap Admin
            </span>
          </div>
          <button
            className="lg:hidden text-warmGray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}>
            
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary-500 text-white' : 'hover:bg-warmGray-800 hover:text-white'}`}>
                
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>);

          })}
        </nav>

        <div className="p-4 border-t border-warmGray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-warmGray-400 hover:bg-warmGray-800 hover:text-white transition-colors">
            
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-warmGray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-warmGray-500 hover:text-warmGray-900"
              onClick={() => setIsSidebarOpen(true)}>
              
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-serif font-semibold text-warmGray-900 hidden sm:block">
              {currentTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-warmGray-400"
                size={18} />
              
              <input
                type="text"
                placeholder="Search admin..."
                className="pl-10 pr-4 py-2 rounded-full bg-warmGray-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-sm w-64" />
              
            </div>

            <button className="relative p-2 text-warmGray-500 hover:text-warmGray-900 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-warmGray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-warmGray-900">
                  Admin User
                </p>
                <p className="text-xs text-warmGray-500">Super Admin</p>
              </div>
              <img
                src={currentUser.avatar}
                alt="Admin"
                className="w-9 h-9 rounded-full border border-warmGray-200" />
              
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>);

}