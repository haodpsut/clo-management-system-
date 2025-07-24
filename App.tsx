
import React, { useState, useEffect, useCallback } from 'react';
import { Course, CLO, PloMapping, Evaluation } from './types';
import { PLO_LIST, BLOOM_LEVELS, SKILL_TYPES } from './constants';
import { CourseInfo } from './components/CourseInfo';
import { CloManager } from './components/CloManager';
import { PloMappingMatrix } from './components/PloMappingMatrix';
import { CloEvaluation } from './components/CloEvaluation';
import { ApiKeyModal } from './components/ApiKeyModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { BookOpenIcon, CheckCircleIcon, Cog6ToothIcon, LinkIcon, PresentationChartBarIcon, Squares2x2Icon } from './components/ui/icons/Icons';
import { Dashboard } from './components/Dashboard';

type AppView = 'DASHBOARD' | 'INFO' | 'CLO' | 'MAPPING' | 'EVALUATION';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('DASHBOARD');
  const [isApiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini_api_key', '');
  const [openRouterKey, setOpenRouterKey] = useLocalStorage<string>('openrouter_api_key', '');
  const [openRouterModel, setOpenRouterModel] = useLocalStorage<string>('openrouter_model', 'openai/gpt-3.5-turbo');

  const [course, setCourse] = useLocalStorage<Course>('courseInfo', {
    name: '',
    code: '',
    credits: 3,
    description: '',
  });

  const [clos, setClos] = useLocalStorage<CLO[]>('clos', []);
  const [ploMapping, setPloMapping] = useLocalStorage<PloMapping>('ploMapping', {});
  const [evaluations, setEvaluations] = useLocalStorage<Evaluation[]>('evaluations', []);

  useEffect(() => {
    // On first load, if there's no API key, open the modal.
    const key = localStorage.getItem('gemini_api_key');
    if (key === null) { // only check on first load
      setApiKeyModalOpen(true);
    }
  }, []);

  const addClo = (newClo: Omit<CLO, 'id'>) => {
    setClos(prev => [...prev, { ...newClo, id: `CLO${prev.length + 1}` }]);
  };

  const updateClo = (updatedClo: CLO) => {
    setClos(prev => prev.map(clo => clo.id === updatedClo.id ? updatedClo : clo));
  };

  const deleteClo = (cloId: string) => {
    setClos(prev => prev.filter(clo => clo.id !== cloId));
    setPloMapping(prev => {
        const newMapping = {...prev};
        delete newMapping[cloId];
        return newMapping;
    });
    setEvaluations(prev => prev.filter(ev => ev.cloId !== cloId));
  };

  const handleApiKeySave = (keys: { gemini: string; openrouter: string; model: string }) => {
    setApiKey(keys.gemini);
    setOpenRouterKey(keys.openrouter);
    setOpenRouterModel(keys.model);
    setApiKeyModalOpen(false);
    // If the user saves an empty required key, re-prompt them.
    if (!keys.gemini) {
        setTimeout(() => setApiKeyModalOpen(true), 100);
    }
  };

  const NavItem = ({ currentView, targetView, icon, label }: { currentView: AppView, targetView: AppView, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setView(targetView)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left ${
        currentView === targetView
          ? 'bg-primary text-white shadow-md'
          : 'text-slate-600 hover:bg-sky-100 hover:text-primary'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800">
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onSave={handleApiKeySave}
        initialKeys={{ gemini: apiKey, openrouter: openRouterKey, model: openRouterModel }}
      />
      
      <aside className="w-full md:w-64 bg-surface p-4 border-b md:border-r border-slate-200 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-6 px-2">
          <CheckCircleIcon className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold text-slate-800">Hệ Thống CLO</h1>
        </div>
        <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
            <NavItem currentView={view} targetView="DASHBOARD" icon={<Squares2x2Icon className="w-5 h-5"/>} label="Bảng Điều Khiển" />
            <NavItem currentView={view} targetView="INFO" icon={<BookOpenIcon className="w-5 h-5"/>} label="Thông Tin Khóa Học" />
            <NavItem currentView={view} targetView="CLO" icon={<Cog6ToothIcon className="w-5 h-5"/>} label="Quản Lý CLO" />
            <NavItem currentView={view} targetView="MAPPING" icon={<LinkIcon className="w-5 h-5"/>} label="Ma Trận CLO-PLO" />
            <NavItem currentView={view} targetView="EVALUATION" icon={<PresentationChartBarIcon className="w-5 h-5"/>} label="Đánh Giá" />
        </nav>
        <div className="mt-auto pt-4 hidden md:block">
            <button 
                onClick={() => setApiKeyModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-slate-500 hover:bg-slate-200 rounded-lg"
            >
                <Cog6ToothIcon className="w-4 h-4" />
                <span>Cài Đặt API</span>
            </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {view === 'DASHBOARD' && <Dashboard course={course} clos={clos} mapping={ploMapping} plos={PLO_LIST} setMapping={setPloMapping} />}
        {view === 'INFO' && <CourseInfo course={course} setCourse={setCourse} setClos={setClos} setPloMapping={setPloMapping} setEvaluations={setEvaluations} />}
        {view === 'CLO' && <CloManager clos={clos} addClo={addClo} updateClo={updateClo} deleteClo={deleteClo} courseContext={{name: course.name, description: course.description}} />}
        {view === 'MAPPING' && <PloMappingMatrix clos={clos} plos={PLO_LIST} mapping={ploMapping} setMapping={setPloMapping} />}
        {view === 'EVALUATION' && <CloEvaluation clos={clos} evaluations={evaluations} setEvaluations={setEvaluations} course={course} ploMapping={ploMapping} />}
      </main>
    </div>
  );
};

export default App;
