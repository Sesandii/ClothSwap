import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-white border-t border-warmGray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif font-bold text-2xl text-primary-500 tracking-tight">
                ClothSwap
              </span>
            </Link>
            <p className="text-warmGray-500 text-sm mb-4">
              Sustainable fashion through community swapping. Refresh your
              wardrobe without spending a dime.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-warmGray-400 hover:text-primary-500 transition-colors">
                
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-warmGray-400 hover:text-primary-500 transition-colors">
                
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-warmGray-400 hover:text-primary-500 transition-colors">
                
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-warmGray-900 mb-4">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/browse"
                  className="text-warmGray-500 hover:text-primary-500 transition-colors">
                  
                  Browse Clothes
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-warmGray-500 hover:text-primary-500 transition-colors">
                  
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-warmGray-500 hover:text-primary-500 transition-colors">
                  
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="text-warmGray-500 hover:text-primary-500 transition-colors">
                  
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-warmGray-900 mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/help"
                  className="text-warmGray-500 hover:text-primary-500 transition-colors">
                  
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="text-warmGray-500 hover:text-primary-500 transition-colors">
                  
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-warmGray-500 hover:text-primary-500 transition-colors">
                  
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/complaints"
                  className="text-warmGray-500 hover:text-primary-500 transition-colors">
                  
                  Report an Issue
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-warmGray-900 mb-4">
              Stay in the Loop
            </h3>
            <p className="text-warmGray-500 text-sm mb-4">
              Get updates on new features and community highlights.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-warmGray-50 border border-warmGray-200 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
              
              <button
                type="submit"
                className="bg-primary-500 text-white px-3 py-2 rounded-r-md text-sm font-medium hover:bg-primary-600 transition-colors">
                
                <Mail size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-warmGray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-warmGray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ClothSwap. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              to="/privacy"
              className="text-warmGray-400 hover:text-warmGray-600 transition-colors">
              
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-warmGray-400 hover:text-warmGray-600 transition-colors">
              
              Terms of Service
            </Link>
            <Link
              to="/admin/login"
              className="text-warmGray-400 hover:text-warmGray-600 transition-colors">
              
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>);

}