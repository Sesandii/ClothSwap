import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
export function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Logged in successfully');
    navigate('/admin/dashboard');
  };
  return (
    <div className="min-h-screen bg-warmGray-900 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="bg-warmGray-800 p-8 text-center">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-primary-500" size={32} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-warmGray-400 text-sm">
            Sign in to manage ClothSwap
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-warmGray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                defaultValue="admin@clothswap.com"
                className="w-full px-4 py-2.5 rounded-xl border border-warmGray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-warmGray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  defaultValue="admin123"
                  className="w-full px-4 py-2.5 rounded-xl border border-warmGray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all pr-10" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warmGray-400 hover:text-warmGray-600">
                  
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-primary-500 focus:ring-primary-500 border-warmGray-300" />
                
                <span className="text-sm text-warmGray-600">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-warmGray-900 hover:bg-black text-white rounded-xl font-medium transition-colors mt-4">
              
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </motion.div>
    </div>);

}