import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Search, Heart, MessageSquare } from 'lucide-react';
import { getAuthenticatedUser, getInitials, getStoredToken, isRealProfilePic, logout } from '../lib/auth';
import { getUnreadMessageCount, getUnreadNotificationCount } from '../lib/api';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const location = useLocation();
  const isLoggedIn = Boolean(getStoredToken());
  const currentUser = getAuthenticatedUser();
  const navLinks = [
    {
      name: 'Browse',
      path: '/browse'
    },
    ...(isLoggedIn ? [{
      name: 'My Clothes',
      path: '/my-clothes'
    }, {
      name: 'Swaps',
      path: '/my-swaps'
    }] : [])];

  const isActive = (path: string) => location.pathname.startsWith(path);

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadNotifications(0);
      setUnreadMessages(0);
      return;
    }

    const loadUnreadNotifications = async () => {
      try {
        const response = await getUnreadNotificationCount();

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { count?: number };
        setUnreadNotifications(data.count || 0);
      } catch {
        setUnreadNotifications(0);
      }
    };

    void loadUnreadNotifications();
    window.addEventListener('clothswap:notifications-updated', loadUnreadNotifications);

    return () => {
      window.removeEventListener('clothswap:notifications-updated', loadUnreadNotifications);
    };
  }, [isLoggedIn, location.pathname]);

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadMessages(0);
      return;
    }

    const loadUnreadMessages = async () => {
      try {
        const response = await getUnreadMessageCount();

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { count?: number };
        setUnreadMessages(data.count || 0);
      } catch {
        setUnreadMessages(0);
      }
    };

    void loadUnreadMessages();
    const intervalId = window.setInterval(loadUnreadMessages, 15000);
    window.addEventListener('clothswap:messages-updated', loadUnreadMessages);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('clothswap:messages-updated', loadUnreadMessages);
    };
  }, [isLoggedIn, location.pathname]);

  const notificationBadge =
    unreadNotifications > 9 ? '9+' : unreadNotifications > 0 ? String(unreadNotifications) : '';

  return (
    <nav className="bg-white border-b border-warmGray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif font-bold text-2xl text-primary-500 tracking-tight">
                ClothSwap
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) =>
                <Link
                  key={link.name}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive(link.path) ? 'border-primary-500 text-warmGray-900' : 'border-transparent text-warmGray-500 hover:border-warmGray-300 hover:text-warmGray-700'}`}>

                  {link.name}
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLoggedIn && currentUser ?
              <>
                <Link
                  to="/browse"
                  className="p-2 text-warmGray-400 hover:text-warmGray-500 transition-colors">

                  <Search size={20} />
                </Link>
                <Link
                  to="/favorites"
                  className="p-2 text-warmGray-400 hover:text-primary-500 transition-colors">

                  <Heart size={20} />
                </Link>
                <Link
                  to="/chat"
                  className="p-2 text-warmGray-400 hover:text-warmGray-500 transition-colors relative">

                  <MessageSquare size={20} />
                  {unreadMessages > 0 && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white"></span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  className="p-2 text-warmGray-400 hover:text-warmGray-500 transition-colors relative">

                  <Bell size={20} />
                  {notificationBadge && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary-500 ring-2 ring-white text-[10px] font-semibold text-white flex items-center justify-center">
                      {notificationBadge}
                    </span>
                  )}
                </Link>

                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                      className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">

                      <span className="sr-only">Open user menu</span>
                      {isRealProfilePic(currentUser.profilePic || currentUser.avatar) ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover border border-warmGray-200 bg-white"
                          src={currentUser.profilePic || currentUser.avatar}
                          alt={currentUser.name} />
                      ) : (
                        <div className="h-8 w-8 rounded-full border border-warmGray-200 bg-primary-500 text-white flex items-center justify-center text-xs font-semibold">
                          {getInitials(currentUser.name)}
                        </div>
                      )}

                    </button>
                  </div>

                  {isProfileDropdownOpen &&
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileDropdownOpen(false)}>
                      </div>
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-20">
                        <div className="px-4 py-2 border-b border-warmGray-100">
                          <p className="text-sm font-medium text-warmGray-900 truncate">
                            {currentUser.name}
                          </p>
                          <p className="text-xs text-warmGray-500 truncate">
                            {currentUser.email}
                          </p>
                        </div>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-warmGray-700 hover:bg-warmGray-50"
                          onClick={() => setIsProfileDropdownOpen(false)}>

                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-warmGray-700 hover:bg-warmGray-50"
                          onClick={() => setIsProfileDropdownOpen(false)}>

                          Your Profile
                        </Link>
                        <Link
                          to="/add-clothes"
                          className="block px-4 py-2 text-sm text-warmGray-700 hover:bg-warmGray-50"
                          onClick={() => setIsProfileDropdownOpen(false)}>

                          Add Clothes
                        </Link>
                        <div className="border-t border-warmGray-100"></div>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-primary-600 hover:bg-warmGray-50"
                          onClick={() => {
                            logout();
                            setIsProfileDropdownOpen(false);
                          }}>

                          Sign out
                        </Link>
                      </div>
                    </>
                  }
                </div>

                <Link
                  to="/add-clothes"
                  className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">

                  Upload
                </Link>
              </> :
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-warmGray-700 hover:text-warmGray-900 transition-colors">

                  Log in
                </Link>
                <Link
                  to="/register"
                  className="ml-2 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors">

                  Sign up
                </Link>
              </>
            }
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-warmGray-400 hover:text-warmGray-500 hover:bg-warmGray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">

              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ?
                <X className="block h-6 w-6" aria-hidden="true" /> :

                <Menu className="block h-6 w-6" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen &&
        <div className="md:hidden bg-white border-b border-warmGray-200">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) =>
              <Link
                key={link.name}
                to={link.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive(link.path) ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-warmGray-600 hover:bg-warmGray-50 hover:border-warmGray-300 hover:text-warmGray-800'}`}
                onClick={() => setIsMobileMenuOpen(false)}>

                {link.name}
              </Link>
            )}
          </div>
          {isLoggedIn && currentUser ?
            <div className="pt-4 pb-3 border-t border-warmGray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {isRealProfilePic(currentUser.profilePic || currentUser.avatar) ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover bg-white"
                      src={currentUser.profilePic || currentUser.avatar}
                      alt={currentUser.name} />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
                      {getInitials(currentUser.name)}
                    </div>
                  )}

                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-warmGray-800">
                    {currentUser.name}
                  </div>
                  <div className="text-sm font-medium text-warmGray-500">
                    {currentUser.email}
                  </div>
                </div>
                <Link
                  to="/notifications"
                  className="ml-auto flex-shrink-0 p-1 text-warmGray-400 hover:text-warmGray-500 relative">

                  <Bell size={24} />
                  {notificationBadge && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary-500 ring-2 ring-white text-[10px] font-semibold text-white flex items-center justify-center">
                      {notificationBadge}
                    </span>
                  )}
                </Link>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-base font-medium text-warmGray-600 hover:text-warmGray-800 hover:bg-warmGray-50"
                  onClick={() => setIsMobileMenuOpen(false)}>

                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-warmGray-600 hover:text-warmGray-800 hover:bg-warmGray-50"
                  onClick={() => setIsMobileMenuOpen(false)}>

                  Your Profile
                </Link>
                <Link
                  to="/add-clothes"
                  className="block px-4 py-2 text-base font-medium text-warmGray-600 hover:text-warmGray-800 hover:bg-warmGray-50"
                  onClick={() => setIsMobileMenuOpen(false)}>

                  Add Clothes
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-primary-600 hover:text-primary-800 hover:bg-warmGray-50"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}>

                  Sign out
                </Link>
              </div>
            </div> :
            <div className="py-3 border-t border-warmGray-200 px-4 space-y-2">
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-warmGray-700 hover:bg-warmGray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}>

                Log in
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-base font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}>

                Sign up
              </Link>
            </div>
          }
        </div>
      }
    </nav>);

}
