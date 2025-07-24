
import React from 'react';
import { Course, CLO, PloMapping, PLO } from '../types';
import { Card, CardHeader, CardTitle } from './ui/Card';
import { BookOpenIcon, CheckCircleIcon, LinkIcon } from './ui/icons/Icons';
import { BLOOM_LEVELS } from '../constants';

interface DashboardProps {
  course: Course;
  clos: CLO[];
  mapping: PloMapping;
  plos: PLO[];
  setMapping: React.Dispatch<React.SetStateAction<PloMapping>>;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-4 border border-slate-200">
        <div className="bg-sky-100 text-primary p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);


export const Dashboard: React.FC<DashboardProps> = ({ course, clos, mapping, plos, setMapping }) => {
    
    const handleMappingChange = (cloId: string, ploId: string) => {
        setMapping(prev => {
          const currentMappings = prev[cloId] || [];
          const newMappings = currentMappings.includes(ploId)
            ? currentMappings.filter(id => id !== ploId)
            : [...currentMappings, ploId];
          return { ...prev, [cloId]: newMappings };
        });
    };
    
    const bloomLevelCounts = React.useMemo(() => {
        const counts: Record<string, number> = {};
        BLOOM_LEVELS.forEach(level => counts[level] = 0);
        clos.forEach(clo => {
            if (counts[clo.bloomLevel] !== undefined) {
                counts[clo.bloomLevel]++;
            }
        });
        return counts;
    }, [clos]);

    const mappedClosCount = Object.keys(mapping).filter(cloId => clos.some(c => c.id === cloId) && mapping[cloId]?.length > 0).length;

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold text-slate-800">Bảng Điều Khiển</h1>
                <p className="mt-1 text-slate-600">Tổng quan về khóa học, chuẩn đầu ra và các ánh xạ của bạn.</p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard title="Tổng số CLO" value={clos.length} icon={<CheckCircleIcon className="w-6 h-6"/>}/>
                 <StatCard title="CLO đã ánh xạ" value={`${mappedClosCount} / ${clos.length}`} icon={<LinkIcon className="w-6 h-6"/>}/>
                 <StatCard title="Số tín chỉ" value={course.credits} icon={<BookOpenIcon className="w-6 h-6"/>}/>
            </div>
           
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                     {/* Course Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tổng Quan Khóa Học</CardTitle>
                        </CardHeader>
                        <div className="space-y-3 text-slate-700 p-2">
                           <p><strong className="font-semibold text-slate-800">Tên:</strong> {course.name || 'Chưa đặt'}</p>
                           <p><strong className="font-semibold text-slate-800">Mã:</strong> {course.code || 'Chưa đặt'}</p>
                           <p><strong className="font-semibold text-slate-800">Mô tả:</strong> {course.description || 'Chưa đặt'}</p>
                        </div>
                    </Card>
                    
                    {/* CLO List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Các Chuẩn Đầu Ra (CLO) Đã Xác Định</CardTitle>
                        </CardHeader>
                         <div className="space-y-4 max-h-[26rem] overflow-y-auto pr-2">
                          {clos.length > 0 ? clos.map((clo) => (
                            <div key={clo.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-bold text-primary">{clo.id}</p>
                                <p className="mt-1 text-slate-700">{clo.description}</p>
                                <div className="flex gap-2 mt-2">
                                  <span className="text-xs font-medium bg-sky-100 text-sky-800 px-2 py-1 rounded-full">{clo.bloomLevel}</span>
                                  <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{clo.skillType}</span>
                                </div>
                            </div>
                          )) : <p className="text-slate-500 text-center py-4">Chưa có CLO nào được xác định. Vào "Quản Lý CLO" để thêm.</p>}
                        </div>
                    </Card>
                </div>
                
                <div className="xl:col-span-1 space-y-8">
                    {/* CLO-PLO Matrix */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ánh Xạ CLO-PLO</CardTitle>
                            <p className="text-slate-500 mt-1 text-sm">Chỉnh sửa nhanh ma trận ánh xạ của bạn tại đây.</p>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="font-semibold text-left p-2 border-b border-slate-200">CLO</th>
                                        {plos.map(plo => <th key={plo.id} className="font-semibold p-2 border-b border-slate-200 text-center" title={plo.description}>{plo.id}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {clos.map(clo => (
                                        <tr key={clo.id} className="hover:bg-sky-50">
                                            <td className="p-2 border-b border-slate-200 font-bold" title={clo.description}>{clo.id}</td>
                                            {plos.map(plo => (
                                                <td key={plo.id} className="p-2 border-b border-slate-200 text-center">
                                                    <input
                                                      type="checkbox"
                                                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                                      checked={mapping[clo.id]?.includes(plo.id) || false}
                                                      onChange={() => handleMappingChange(clo.id, plo.id)}
                                                      aria-label={`Map ${clo.id} to ${plo.id}`}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                     {clos.length === 0 && (
                                        <tr>
                                            <td colSpan={plos.length + 1} className="text-center text-slate-500 py-4">Chưa có CLO để ánh xạ.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                     {/* CLO Stats by Bloom Level */}
                    <Card>
                        <CardHeader>
                            <CardTitle>CLO Theo Cấp Độ Bloom</CardTitle>
                        </CardHeader>
                        <ul className="space-y-2 text-slate-700">
                            {Object.entries(bloomLevelCounts).map(([level, count]) => (
                                <li key={level} className="flex justify-between items-center p-1">
                                    <span>{level}</span>
                                    <span className="font-bold bg-slate-200 text-slate-800 text-xs px-2 py-1 rounded-full">{count}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};
