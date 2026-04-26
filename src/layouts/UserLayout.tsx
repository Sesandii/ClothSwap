import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Toaster } from 'sonner';
export function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-warmGray-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className:
          'font-sans rounded-xl border border-warmGray-200 shadow-lg'
        }} />
      
    </div>);

}