import React from 'react';
import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Toaster } from 'sonner';

const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Outlet />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default RootLayout;
