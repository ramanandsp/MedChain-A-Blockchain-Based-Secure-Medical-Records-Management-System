import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { User, Heart, Activity, Target, Wallet } from 'lucide-react';

export function ProfileSetup() {
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    wallet_address: '',
    health_goals: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        wallet_address: profile.wallet_address || '',
        health_goals: profile.health_goals || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const updates = {
      age: formData.age ? parseInt(formData.age) : undefined,
      gender: formData.gender || undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      wallet_address: formData.wallet_address || undefined,
      health_goals: formData.health_goals || undefined,
    };

    const { error } = await updateProfile(updates);
    setLoading(false);

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
            <p className="text-sm text-gray-600">Complete your health profile for personalized insights</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 rounded-xl text-emerald-700 text-sm">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Activity className="w-4 h-4" />
                <span>Age</span>
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g., 30"
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Gender</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Activity className="w-4 h-4" />
                <span>Height (cm)</span>
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="e.g., 170"
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Activity className="w-4 h-4" />
                <span>Weight (kg)</span>
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="e.g., 70"
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Wallet className="w-4 h-4" />
              <span>MedChain Wallet Address (Optional)</span>
            </label>
            <input
              type="text"
              value={formData.wallet_address}
              onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all font-mono text-sm"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4" />
              <span>Health Goals & Preferences</span>
            </label>
            <textarea
              value={formData.health_goals}
              onChange={(e) => setFormData({ ...formData, health_goals: e.target.value })}
              placeholder="e.g., Improve cardiovascular health, maintain healthy weight, better sleep quality"
              rows={4}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
