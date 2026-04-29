import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
// Layouts
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';
// User Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { BrowseClothes } from './pages/BrowseClothes';
import { ClothesDetails } from './pages/ClothesDetails';
import { AddClothes } from './pages/AddClothes';
import { MyClothes } from './pages/MyClothes';
import { SwapRequest } from './pages/SwapRequest';
import { MySwapRequests } from './pages/MySwapRequests';
import { ExchangeMethod } from './pages/ExchangeMethod';
import { ExchangeTracking } from './pages/ExchangeTracking';
import { Chat } from './pages/Chat';
import { Favorites } from './pages/Favorites';
import { Profile } from './pages/Profile';
import { Reviews } from './pages/Reviews';
import { Complaints } from './pages/Complaints';
import { Notifications } from './pages/Notifications';
// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageClothes } from './pages/admin/ManageClothes';
import { ManageCategories } from './pages/admin/ManageCategories';
import { ManageSwaps } from './pages/admin/ManageSwaps';
import { ExchangeManagement } from './pages/admin/ExchangeManagement';
import { ComplaintManagement } from './pages/admin/ComplaintManagement';
import { FeedbackManagement } from './pages/admin/FeedbackManagement';
import { AdminSettings } from './pages/admin/AdminSettings';
export function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Router>
        <Routes>
          {/* Auth Routes (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* User Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Landing />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="browse" element={<BrowseClothes />} />
            <Route path="clothes/:id" element={<ClothesDetails />} />
            <Route path="add-clothes" element={<AddClothes />} />
            <Route path="edit-clothes/:id" element={<AddClothes />} />
            <Route path="my-clothes" element={<MyClothes />} />
            <Route path="swap-request/:id" element={<SwapRequest />} />
            <Route path="my-swaps" element={<MySwapRequests />} />
            <Route path="exchange/:id" element={<ExchangeMethod />} />
            <Route
              path="exchange-tracking/:id"
              element={<ExchangeTracking />} />
            
            <Route path="chat" element={<Chat />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="clothes" element={<ManageClothes />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="swaps" element={<ManageSwaps />} />
            <Route path="exchange" element={<ExchangeManagement />} />
            <Route path="complaints" element={<ComplaintManagement />} />
            <Route path="feedback" element={<FeedbackManagement />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </>);

}
