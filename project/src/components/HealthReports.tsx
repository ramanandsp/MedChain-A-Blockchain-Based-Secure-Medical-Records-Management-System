import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Upload, FileText, Loader, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface HealthReport {
  id: string;
  file_name: string;
  uploaded_at: string;
  analyzed_at?: string;
  ai_analysis?: {
    insights?: string;
    risk_factors?: string[];
  };
}

export function HealthReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('health_reports')
        .select('*')
        .eq('user_id', user!.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const fileName = `${user!.id}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('health-reports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: reportData, error: insertError } = await supabase
        .from('health_reports')
        .insert([
          {
            user_id: user!.id,
            file_name: file.name,
            file_path: fileName,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      await analyzeReport(reportData.id, file);
      await loadReports();
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const analyzeReport = async (reportId: string, file: File) => {
    setAnalyzing(true);
    try {
      const text = await extractTextFromPDF(file);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-health-report`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            extractedText: text,
            reportId: reportId,
          }),
        }
      );

      if (!response.ok) throw new Error('Analysis failed');

      const { analysis } = await response.json();

      await supabase
        .from('health_reports')
        .update({
          extracted_text: text,
          ai_analysis: analysis,
          analyzed_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (analysis.recommendations) {
        const categories = ['diet', 'exercise', 'lifestyle', 'preventive'] as const;
        const recommendations = categories.map((category) => ({
          user_id: user!.id,
          report_id: reportId,
          category,
          recommendations: analysis.recommendations[category] || {},
        }));

        await supabase.from('health_recommendations').insert(recommendations);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setUploadError('Failed to analyze report. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const text = `Sample health report data from ${file.name}.
This is a simulated extraction. In production, use a proper PDF parsing library.
Blood Pressure: 120/80 mmHg
Cholesterol: 180 mg/dL
Glucose: 95 mg/dL
Heart Rate: 72 bpm`;
        resolve(text);
      };
      reader.readAsText(file);
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Health Report</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-emerald-400 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading || analyzing}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer ${(uploading || analyzing) ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="flex flex-col items-center">
              {uploading || analyzing ? (
                <Loader className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
              ) : (
                <Upload className="w-12 h-12 text-emerald-500 mb-4" />
              )}
              <p className="text-lg font-semibold text-gray-700 mb-2">
                {uploading ? 'Uploading...' : analyzing ? 'Analyzing with AI...' : 'Click to upload PDF'}
              </p>
              <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
            </div>
          </label>
        </div>

        {uploadError && (
          <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl text-red-600 text-sm">
            {uploadError}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Your Reports</h3>
        {reports.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-lg border border-white/50 p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reports uploaded yet</p>
            <p className="text-sm text-gray-500 mt-2">Upload your first health report to get AI-powered insights</p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{report.file_name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(report.uploaded_at).toLocaleDateString()}</span>
                    </div>
                    {report.analyzed_at ? (
                      <div className="flex items-center space-x-2 text-sm text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Analyzed</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-amber-600">
                        <XCircle className="w-4 h-4" />
                        <span>Pending analysis</span>
                      </div>
                    )}
                    {report.ai_analysis?.insights && (
                      <p className="mt-3 text-sm text-gray-700 bg-white/60 rounded-lg p-3">
                        {report.ai_analysis.insights}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
