import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CLO, Evaluation, Course, PloMapping } from '../types';
import { exportToPdf } from '../services/exportService';
import { generateEvaluationSummary } from '../services/geminiService';
import { Card, CardHeader, CardTitle } from './ui/Card';
import { SparklesIcon, ArrowDownTrayIcon } from './ui/icons/Icons';
import { Alert } from './ui/Alert';

interface CloEvaluationProps {
  clos: CLO[];
  evaluations: Evaluation[];
  setEvaluations: React.Dispatch<React.SetStateAction<Evaluation[]>>;
  course: Course;
  ploMapping: PloMapping;
}

export const CloEvaluation: React.FC<CloEvaluationProps> = ({ clos, evaluations, setEvaluations, course, ploMapping }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize evaluations for any new CLOs
    const newEvaluations = clos
      .filter(clo => !evaluations.some(ev => ev.cloId === clo.id))
      .map(clo => ({ cloId: clo.id, achievement: 0 }));
    
    // Cleanup evaluations for deleted CLOs
    const existingCloIds = clos.map(c => c.id);
    const cleanedEvaluations = evaluations.filter(ev => existingCloIds.includes(ev.cloId));

    if (newEvaluations.length > 0 || cleanedEvaluations.length !== evaluations.length) {
      setEvaluations(prev => [...prev.filter(ev => existingCloIds.includes(ev.cloId)), ...newEvaluations]);
    }
  }, [clos, evaluations, setEvaluations]);
  
  const handleAchievementChange = (cloId: string, value: string) => {
    const achievement = Math.max(0, Math.min(100, parseInt(value) || 0));
    setEvaluations(prev => prev.map(ev => ev.cloId === cloId ? { ...ev, achievement } : ev));
  };

  const chartData = useMemo(() => {
    return clos.map(clo => {
      const evaluation = evaluations.find(ev => ev.cloId === clo.id);
      return {
        name: clo.id,
        'Thành tích': evaluation ? evaluation.achievement : 0,
        description: clo.description
      };
    });
  }, [clos, evaluations]);
  
  const handleGenerateSummary = async () => {
    setError(null);
    setIsLoading(true);
    setSummary('');
    const evaluationData = evaluations.map(ev => ({
        ...ev,
        description: clos.find(c => c.id === ev.cloId)?.description || ''
    }));
    try {
        const result = await generateEvaluationSummary(evaluationData);
        setSummary(result);
    } catch(e) {
        setError((e as Error).message);
    } finally {
        setIsLoading(false);
    }
  };

  if (clos.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Đánh Giá CLO</CardTitle>
            </CardHeader>
            <p className="text-slate-500 text-center py-4">Vui lòng thêm CLO trong tab 'Quản Lý CLO' trước khi đánh giá.</p>
        </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nhập Dữ Liệu Hiệu Suất</CardTitle>
          </CardHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {clos.map(clo => {
              const evaluation = evaluations.find(ev => ev.cloId === clo.id);
              return (
                <div key={clo.id}>
                  <label htmlFor={`eval-${clo.id}`} className="block text-sm font-medium text-slate-700">{clo.id} - <span className="text-xs italic">{clo.description}</span></label>
                  <input
                    type="number"
                    id={`eval-${clo.id}`}
                    value={evaluation ? evaluation.achievement : 0}
                    onChange={(e) => handleAchievementChange(clo.id, e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="% sinh viên đạt được"
                    min="0"
                    max="100"
                  />
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
             <CardHeader className="flex justify-between items-center">
                <CardTitle>Hành Động</CardTitle>
            </CardHeader>
            <div className="space-y-3">
                <button 
                    onClick={handleGenerateSummary}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-emerald-600 transition disabled:bg-slate-400"
                >
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? 'Đang tạo...' : 'Tạo Tóm Tắt Bằng AI'}
                </button>
                <button
                    onClick={() => exportToPdf(course, clos, ploMapping, evaluations)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-slate-700 transition"
                >
                    <ArrowDownTrayIcon className="w-5 h-5"/>
                    Xuất Báo Cáo Đầy Đủ (PDF)
                </button>
                 {error && <Alert message={error} type="error" onClose={() => setError(null)} className="mt-3"/>}
            </div>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Biểu Đồ Thành Tích CLO</CardTitle>
          </CardHeader>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" domain={[0, 100]} />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Bar dataKey="Thành tích" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        {summary && (
            <Card>
                <CardHeader>
                    <CardTitle>Tóm Tắt Do AI Tạo</CardTitle>
                </CardHeader>
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 whitespace-pre-wrap">{summary}</p>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
};