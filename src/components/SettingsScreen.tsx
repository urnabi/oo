import React, { useState } from 'react';
import {
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit3,
  Smartphone,
  Sparkles,
  Download,
  CheckCircle,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ChatParticipant } from '../types/chat';

interface SettingsScreenProps {
  currentUser: ChatParticipant;
  onUpdateUser: (name: string, email: string) => void;
  onLogout: () => void;
  onOpenApkModal: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentUser,
  onUpdateUser,
  onLogout,
  onOpenApkModal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email || '');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSaveProfile = () => {
    onUpdateUser(editName, editEmail);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-stone-200/50">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <BrandLogo size="sm" showText={true} />

          <div className="text-center">
            <h2 className="text-base font-bold text-stone-900 leading-none">New Chat</h2>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-emerald-700 tracking-tight">
                Mediated
              </span>
            </div>
          </div>

          <div className="rounded-full ring-2 ring-emerald-500/80 p-0.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {/* Title bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Settings</h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDEEE9] text-[#9A3412]">
            <span>🍁</span>
            <span>Mindful State</span>
          </span>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl bg-white p-6 shadow-xs border border-stone-100 flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover shadow-sm"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-3 border-white" />
          </div>

          <h2 className="text-xl font-bold text-stone-900 mt-3">{currentUser.name}</h2>
          <p className="text-xs text-stone-500 mt-0.5">{currentUser.email}</p>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E4F7EC] text-[#0A7B3E]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active Sanctuary Member
            </span>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#FAF7F2] hover:bg-stone-200/80 text-stone-700 text-xs font-semibold transition cursor-pointer border border-stone-200/60"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="mt-4 w-full space-y-2 text-left bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div>
                <label className="text-[10px] font-bold uppercase text-stone-400">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-stone-400">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-1.5 rounded-lg bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings Navigation Menu */}
        <div className="rounded-3xl bg-white shadow-xs border border-stone-100 divide-y divide-stone-100 overflow-hidden">
          {/* Notifications */}
          <div
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-4 flex items-center justify-between hover:bg-stone-50/80 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-stone-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Notifications</h4>
                <p className="text-xs text-stone-500">Chimes and pacing reminders</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-stone-400 font-medium">
              <span>{soundEnabled ? 'Sound' : 'Muted'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Privacy */}
          <div className="p-4 flex items-center justify-between hover:bg-stone-50/80 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-stone-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Privacy</h4>
                <p className="text-xs text-stone-500">Local draft mediation & encryption</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>

          {/* Help & Support */}
          <div className="p-4 flex items-center justify-between hover:bg-stone-50/80 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-stone-600">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Help & Support</h4>
                <p className="text-xs text-stone-500">Mindful communication guides</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </div>

          {/* Android APK & Release Channel item */}
          <div
            onClick={onOpenApkModal}
            className="p-4 flex items-center justify-between bg-gradient-to-r from-indigo-50/40 to-transparent hover:bg-indigo-50/70 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Build APK & Release Channel</h4>
                <p className="text-xs text-stone-500">Install as native WebAPK • Download package</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                v1.0.0 Ready
              </span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>
          </div>
        </div>

        {/* Log out button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-3xl bg-white hover:bg-red-50 text-[#C2410C] font-semibold text-xs border border-stone-200/80 transition cursor-pointer shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of Sanctuary</span>
        </button>
      </div>
    </div>
  );
};
