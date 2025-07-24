
import React from 'react';
import { CLO, PLO, PloMapping } from '../types';
import { Card, CardHeader, CardTitle } from './ui/Card';

interface PloMappingMatrixProps {
  clos: CLO[];
  plos: PLO[];
  mapping: PloMapping;
  setMapping: React.Dispatch<React.SetStateAction<PloMapping>>;
}

export const PloMappingMatrix: React.FC<PloMappingMatrixProps> = ({ clos, plos, mapping, setMapping }) => {
  const handleMappingChange = (cloId: string, ploId: string) => {
    setMapping(prev => {
      const currentMappings = prev[cloId] || [];
      const newMappings = currentMappings.includes(ploId)
        ? currentMappings.filter(id => id !== ploId)
        : [...currentMappings, ploId];
      return { ...prev, [cloId]: newMappings };
    });
  };

  if (clos.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ma Trận CLO-PLO</CardTitle>
            </CardHeader>
            <p className="text-slate-500 text-center py-4">Vui lòng thêm CLO trong tab 'Quản Lý CLO' trước khi ánh xạ chúng với PLO.</p>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ma Trận CLO-PLO</CardTitle>
        <p className="text-slate-500 mt-1">Chọn các ô để ánh xạ mỗi CLO với một hoặc nhiều PLO.</p>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="font-semibold text-left p-3 border-b border-slate-200 sticky left-0 bg-slate-100 z-10 w-48">CLO</th>
              {plos.map(plo => (
                <th key={plo.id} className="font-semibold p-3 border-b border-slate-200 text-center w-24" title={plo.description}>
                  {plo.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clos.map(clo => (
              <tr key={clo.id} className="hover:bg-sky-50">
                <td className="p-3 border-b border-slate-200 sticky left-0 bg-white hover:bg-sky-50 z-10 w-48">
                  <p className="font-bold">{clo.id}</p>
                  <p className="text-xs text-slate-600 truncate" title={clo.description}>{clo.description}</p>
                </td>
                {plos.map(plo => (
                  <td key={plo.id} className="p-3 border-b border-slate-200 text-center w-24">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={mapping[clo.id]?.includes(plo.id) || false}
                      onChange={() => handleMappingChange(clo.id, plo.id)}
                      aria-label={`Map ${clo.id} to ${plo.id}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
