import React, { useState } from 'react';
import { Settings, Bell, Palette, Database, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { showNotification } = useAuth();

  const [settings, setSettings] = useState({
    defaultView: 'grid',
    defaultPriority: 'Medium',
    overdueAlerts: true,
    weeklyReport: false,
    soundEffects: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    showNotification('Preference updated successfully!', 'success');
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    showNotification('Preference updated successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Application Settings</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Customize your experience, default views, and notification alerts.
        </p>
      </div>

      {/* Task Preferences */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <Settings className="w-4 h-4 text-brand-600" />
          <span>Task Preferences</span>
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-800">Default Tasks View</p>
              <p className="text-xs text-slate-500">
                Choose whether tasks display in cards grid or rows table by default.
              </p>
            </div>
            <select
              value={settings.defaultView}
              onChange={(e) => handleChange('defaultView', e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="grid">Grid (Cards)</option>
              <option value="table">Table (Rows)</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-800">Default Task Priority</p>
              <p className="text-xs text-slate-500">
                Pre-selected priority level when creating a new task.
              </p>
            </div>
            <select
              value={settings.defaultPriority}
              onChange={(e) => handleChange('defaultPriority', e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <Bell className="w-4 h-4 text-brand-600" />
          <span>Notifications & Alerts</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Overdue Task Banners</p>
              <p className="text-xs text-slate-500">
                Show prominent visual alerts for overdue tasks in dashboard and task lists.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('overdueAlerts')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.overdueAlerts ? 'bg-brand-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.overdueAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-800">Sound & Haptic Feedback</p>
              <p className="text-xs text-slate-500">
                Play subtle auditory feedback when marking tasks completed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('soundEffects')}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.soundEffects ? 'bg-brand-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.soundEffects ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Backend & Environment Info */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <Database className="w-4 h-4 text-brand-600" />
          <span>System & Database Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-slate-400 font-medium">Database Target</p>
            <p className="font-semibold text-slate-800 mt-0.5">MongoDB Atlas (Mongoose ODM)</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-slate-400 font-medium">Authentication Protocol</p>
            <p className="font-semibold text-slate-800 mt-0.5">JWT (JSON Web Token) with bcrypt</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-slate-400 font-medium">Backend REST Endpoint</p>
            <p className="font-semibold text-slate-800 mt-0.5">http://localhost:5000/api</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-slate-400 font-medium">Frontend Client Port</p>
            <p className="font-semibold text-slate-800 mt-0.5">http://localhost:5173</p>
          </div>
        </div>
      </div>
    </div>
  );
};

