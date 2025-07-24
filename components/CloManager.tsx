import React, { useState } from 'react';
import { CLO } from '../types';
import { BLOOM_LEVELS, SKILL_TYPES } from '../constants';
import { Card, CardHeader, CardTitle } from './ui/Card';
import { suggestCloDescription, suggestBloomLevel } from '../services/geminiService';
import { SparklesIcon, TrashIcon, PencilIcon } from './ui/icons/Icons';
import { Alert } from './ui/Alert';

interface CloManagerProps {
  clos: CLO[];
  addClo: (newClo: Omit<CLO, 'id'>) => void;
  updateClo: (updatedClo: CLO) => void;
  deleteClo: (cloId: string) => void;
  courseContext: { name: string; description: string };
}

const initialFormState = { id: '', description: '', bloomLevel: BLOOM_LEVELS[2], skillType: SKILL_TYPES[0] };

export const CloManager: React.FC<CloManagerProps> = ({ clos, addClo, updateClo, deleteClo, courseContext }) => {
  const [formState, setFormState] = useState<Omit<CLO, 'id'> & { id?: string }>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState<null | 'description' | 'bloom'>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSuggestDescription = async () => {
    if (!formState.bloomLevel) {
        setError("Vui lòng chọn Cấp độ Bloom trước.");
        return;
    }
    setError(null);
    setIsLoadingAi('description');
    try {
        const suggestion = await suggestCloDescription(formState.bloomLevel, courseContext.name, courseContext.description);
        setFormState(prev => ({ ...prev, description: suggestion }));
    } catch(e) {
        setError((e as Error).message);
    } finally {
        setIsLoadingAi(null);
    }
  };
  
  const handleSuggestBloom = async () => {
    if (!formState.description) {
      setError("Vui lòng nhập mô tả trước.");
      return;
    }
    setError(null);
    setIsLoadingAi('bloom');
    try {
        const suggestion = await suggestBloomLevel(formState.description);
        if (BLOOM_LEVELS.includes(suggestion)) {
            setFormState(prev => ({...prev, bloomLevel: suggestion}));
        } else {
            setError(`AI đã đề xuất một cấp độ không có trong danh sách: ${suggestion}. Vui lòng kiểm tra lại mô tả.`);
        }
    } catch (e) {
        setError((e as Error).message);
    } finally {
        setIsLoadingAi(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.description) return;
    
    if (isEditing && formState.id) {
        updateClo({
            id: formState.id,
            description: formState.description,
            bloomLevel: formState.bloomLevel,
            skillType: formState.skillType
        });
    } else {
        const { id, ...newClo } = formState;
        addClo(newClo);
    }
    
    setFormState(initialFormState);
    setIsEditing(false);
    setError(null);
  };
  
  const handleEdit = (clo: CLO) => {
    setIsEditing(true);
    setFormState(clo);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormState(initialFormState);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Chỉnh Sửa CLO' : 'Thêm Chuẩn Đầu Ra Mới (CLO)'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Mô Tả</label>
            <textarea
              name="description"
              id="description"
              value={formState.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="bloomLevel" className="block text-sm font-medium text-slate-700">Cấp Độ Bloom</label>
                <select name="bloomLevel" id="bloomLevel" value={formState.bloomLevel} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                {BLOOM_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="skillType" className="block text-sm font-medium text-slate-700">Loại Kỹ Năng</label>
                <select name="skillType" id="skillType" value={formState.skillType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                {SKILL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
          </div>
           <div className="flex flex-wrap gap-2 pt-2">
                <button type="button" onClick={handleSuggestDescription} disabled={!!isLoadingAi} className="flex items-center gap-2 px-3 py-2 text-sm bg-accent text-white rounded-md hover:bg-emerald-600 transition disabled:bg-slate-400">
                    <SparklesIcon className="w-4 h-4" /> {isLoadingAi === 'description' ? 'Đang tạo...' : 'Gợi Ý Mô Tả'}
                </button>
                 <button type="button" onClick={handleSuggestBloom} disabled={!!isLoadingAi} className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-white rounded-md hover:bg-slate-700 transition disabled:bg-slate-400">
                    <SparklesIcon className="w-4 h-4" /> {isLoadingAi === 'bloom' ? 'Đang phân tích...' : 'Gợi Ý Cấp Độ Bloom'}
                </button>
            </div>
            {error && <Alert message={error} type="error" onClose={() => setError(null)} className="mt-4" />}
          <div className="flex justify-end gap-3 pt-4">
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Hủy</button>
            )}
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark shadow-sm">{isEditing ? 'Cập Nhật CLO' : 'Thêm CLO'}</button>
          </div>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Các CLO Đã Quản Lý</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          {clos.length > 0 ? clos.map((clo, index) => (
            <div key={clo.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between">
              <div>
                <p className="font-bold text-primary">{clo.id}</p>
                <p className="mt-1 text-slate-700">{clo.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs font-medium bg-sky-100 text-sky-800 px-2 py-1 rounded-full">{clo.bloomLevel}</span>
                  <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{clo.skillType}</span>
                </div>
              </div>
              <div className="flex space-x-2 flex-shrink-0 ml-4">
                <button onClick={() => handleEdit(clo)} className="p-2 text-slate-500 hover:text-primary rounded-full hover:bg-slate-200 transition"><PencilIcon className="w-5 h-5"/></button>
                <button onClick={() => deleteClo(clo.id)} className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-200 transition"><TrashIcon className="w-5 h-5"/></button>
              </div>
            </div>
          )) : <p className="text-slate-500 text-center py-4">Chưa có CLO nào được thêm.</p>}
        </div>
      </Card>
    </div>
  );
};