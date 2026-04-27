import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { saveAuth } from '../lib/auth';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await apiFetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in');
      }

      saveAuth(data.token, data.user);
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-warmGray-900 mb-2">
            ClothSwap
          </h1>
          <p className="text-warmGray-600">Welcome back! Sign in to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-warmGray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-warmGray-700 mb-2">

                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
                required />

            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-warmGray-700 mb-2">

                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-warmGray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  required />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warmGray-400 hover:text-warmGray-600 transition-colors">

                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-warmGray-300 text-primary-500 focus:ring-primary-500" />

                <span className="ml-2 text-warmGray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-primary-500 hover:text-primary-600 font-medium transition-colors">

                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed">

              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-warmGray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-500 hover:text-primary-600 font-medium transition-colors">

              Sign Up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>);

}