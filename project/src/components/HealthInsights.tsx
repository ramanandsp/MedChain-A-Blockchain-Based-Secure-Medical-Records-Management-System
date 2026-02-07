import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Apple, Dumbbell, Heart, Shield, TrendingUp, Loader } from 'lucide-react';

interface Recommendation {
  id: string;
  category: 'diet' | 'exercise' | 'lifestyle' | 'preventive';
  recommendations: {
    title: string;
    items: string[];
  };
}

interface HealthMetric {
  value: string;
  unit: string;
  status: 'normal' | 'high' | 'low';
}

interface LatestReport {
  ai_analysis?: {
    metrics?: Record<string, HealthMetric>;
    risk_factors?: string[];
    insights?: string;
  };
}

export function HealthInsights() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [latestReport, setLatestReport] = useState<LatestReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recsResult, reportResult] = await Promise.all([
        supabase
          .from('health_recommendations')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false })
          .limit(4),
        supabase
          .from('health_reports')
          .select('ai_analysis')
          .eq('user_id', user!.id)
          .not('ai_analysis', 'is', null)
          .order('uploaded_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (recsResult.data) {
        setRecommendations(recsResult.data);
      }

      if (reportResult.data) {
        setLatestReport(reportResult.data);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    diet: Apple,
    exercise: Dumbbell,
    lifestyle: Heart,
    preventive: Shield,
  };

  const categoryColors = {
    diet: 'from-green-400 to-emerald-500',
    exercise: 'from-blue-400 to-cyan-500',
    lifestyle: 'from-pink-400 to-rose-500',
    preventive: 'from-amber-400 to-orange-500',
  };

  const categoryLabels = {
    diet: 'Nutrition',
    exercise: 'Exercise',
    lifestyle: 'Lifestyle',
    preventive: 'Prevention',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!latestReport && recommendations.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-12 text-center">
        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">No Health Data Yet</h3>
        <p className="text-gray-600 mb-6">
          Upload your first health report to get personalized AI-powered insights and recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {latestReport?.ai_analysis?.insights && (
        <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-3xl shadow-2xl border border-white/50 p-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Health Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                {latestReport.ai_analysis.insights}
              </p>
            </div>
          </div>
        </div>
      )}

      {latestReport?.ai_analysis?.metrics && (
        <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Key Health Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(latestReport.ai_analysis.metrics).map(([name, metric]) => (
              <div
                key={name}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      metric.status === 'normal'
                        ? 'bg-green-100 text-green-700'
                        : metric.status === 'high'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {metric.status}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {metric.value} <span className="text-sm text-gray-500">{metric.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {latestReport?.ai_analysis?.risk_factors && latestReport.ai_analysis.risk_factors.length > 0 && (
        <div className="backdrop-blur-xl bg-red-50/40 rounded-3xl shadow-2xl border border-red-200/50 p-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-red-400 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-800 mb-3">Risk Factors</h3>
              <ul className="space-y-2">
                {latestReport.ai_analysis.risk_factors.map((risk, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-red-700">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <>
          <h3 className="text-xl font-bold text-gray-800">Personalized Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec) => {
              const Icon = categoryIcons[rec.category];
              const colorClass = categoryColors[rec.category];
              const label = categoryLabels[rec.category];

              return (
                <div
                  key={rec.id}
                  className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-6 hover:shadow-3xl transition-all"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 bg-gradient-to-br ${colorClass} rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">{label}</h4>
                  </div>
                  {rec.recommendations.title && (
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      {rec.recommendations.title}
                    </p>
                  )}
                  <ul className="space-y-2">
                    {rec.recommendations.items?.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                        <span className="text-emerald-500 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
