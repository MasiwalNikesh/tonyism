"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  password: string;
}

export default function AdminLogin() {
  const [formData, setFormData] = useState<LoginFormData>({ password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('adminToken');
    if (token === 'admin123') {
      router.push('/admin/testimonials');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple client-side password check
    // In production, this should be server-side authentication
    if (formData.password === 'admin123') {
      localStorage.setItem('adminToken', 'admin123');
      router.push('/admin/testimonials');
    } else {
      setError('Invalid password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Testimonials Content Management System
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter admin password"
              value={formData.password}
              onChange={(e) => setFormData({ password: e.target.value })}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <p>Demo credentials: admin123</p>
            <p className="mt-2">⚠️ For demo purposes only. In production, use proper authentication.</p>
          </div>
        </form>
      </div>
    </div>
  );
}