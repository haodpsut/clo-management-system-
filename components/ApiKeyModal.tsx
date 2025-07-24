
import React, { useState, useEffect } from 'react';
import { OPEN_ROUTER_MODELS } from '../constants';
import { XCircleIcon } from './ui/icons/Icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: { gemini: string; openrouter: string; model: string }) => void;
  initialKeys: { gemini: string; openrouter: string; model: string };
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, initialKeys }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [openRouterModel, setOpenRouterModel] = useState('');
  
  useEffect(() => {
    setGeminiKey(initialKeys.gemini);
    setOpenRouterKey(initialKeys.openrouter);
    setOpenRouterModel(initialKeys.model);
  }, [initialKeys, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ gemini: geminiKey, openrouter: openRouterKey, model: openRouterModel });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4 transform transition-all">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-slate-800">Cài Đặt API Key</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XCircleIcon className="w-8 h-8"/>
          </button>
        </div>
        <p className="mt-2 text-slate-600">
          Cần có khóa API Gemini cho các tính năng AI. Các gợi ý của AI sẽ không hoạt động nếu không có nó.
        </p>
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="gemini-key" className="block text-sm font-medium text-slate-700">
              Khóa API Gemini (Bắt buộc)
            </label>
            <input
              type="password"
              id="gemini-key"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Nhập khóa API Gemini của bạn"
            />
          </div>
          <div>
            <label htmlFor="openrouter-key" className="block text-sm font-medium text-slate-700">
              Khóa API OpenRouter (Tùy chọn)
            </label>
            <input
              type="password"
              id="openrouter-key"
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Nhập khóa API OpenRouter của bạn"
            />
          </div>
          <div>
            <label htmlFor="openrouter-model" className="block text-sm font-medium text-slate-700">
              Mô Hình OpenRouter Miễn Phí (nếu sử dụng)
            </label>
            <select
              id="openrouter-model"
              value={openRouterModel}
              onChange={(e) => setOpenRouterModel(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              {OPEN_ROUTER_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition shadow-sm"
          >
            Lưu Khóa
          </button>
        </div>
      </div>
    </div>
  );
};
