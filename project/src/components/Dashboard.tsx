import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { ProfileSetup } from './ProfileSetup';
import { HealthReports } from './HealthReports';
import { AIChat } from './AIChat';
import { HealthInsights } from './HealthInsights';
import { LogOut, Heart, User, FileText, MessageCircle, Activity } from 'lucide-react';

type Tab = 'insights' | 'reports' | 'chat' | 'profile';

export function Dashboard() {
  const { signOut } = useAuth();
  const { profile, loading } = useProfile();
  const [activeTab, setActiveTab] = useState<Tab>('insights');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!profile?.age || !profile?.gender) {
    return <ProfileSetup />;
  }

  const tabs = [
    { id: 'insights' as Tab, label: 'Health Insights', icon: Activity },
    { id: 'reports' as Tab, label: 'Reports', icon: FileText },
    { id: 'chat' as Tab, label: 'AI Coach', icon: MessageCircle },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      <nav className="bg-white/40 backdrop-blur-xl border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl shadow-lg">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  MedChain AI Friend
                </h1>
                <p className="text-xs text-gray-500">Welcome back, {profile?.full_name}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-2 mb-8 bg-white/40 backdrop-blur-xl p-2 rounded-2xl border border-white/50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="animate-fadeIn">
          {activeTab === 'insights' && <HealthInsights />}
          {activeTab === 'reports' && <HealthReports />}
          {activeTab === 'chat' && <AIChat />}
          {activeTab === 'profile' && <ProfileSetup />}
        </div>
      </div>
    </div>
  );
}
