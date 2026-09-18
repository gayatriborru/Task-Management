import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Layers, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-600 rounded-2xl text-white shadow-lg shadow-brand-500/30 mb-3">
          <Layers className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          TaskFlow
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Streamline your workflow, prioritize tasks, and conquer deadlines.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

