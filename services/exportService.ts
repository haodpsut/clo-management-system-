import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Course, CLO, PloMapping, Evaluation } from '../types';
import { PLO_LIST } from '../constants';

// Augment jsPDF to include the lastAutoTable property from the autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY?: number;
    };
  }
}

export const exportToPdf = (course: Course, clos: CLO[], mapping: PloMapping, evaluations: Evaluation[]) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text('Course Learning Outcome (CLO) Report', 14, 22);

  // Course Info
  doc.setFontSize(12);
  doc.text(`Course: ${course.name} (${course.code})`, 14, 32);
  doc.text(`Credits: ${course.credits}`, 14, 38);
  doc.setFontSize(10);
  const splitDesc = doc.splitTextToSize(`Description: ${course.description}`, 180);
  doc.text(splitDesc, 14, 44);

  // Calculate Y position after the description text block.
  const descDim = doc.getTextDimensions(splitDesc);
  const yPosAfterDesc = 44 + descDim.h;

  // CLOs Table
  doc.setFontSize(14);
  doc.text('Course Learning Outcomes (CLOs)', 14, yPosAfterDesc + 10);
  autoTable(doc, {
    startY: yPosAfterDesc + 15,
    head: [['ID', 'Description', 'Bloom\'s Level', 'Skill Type']],
    body: clos.map(clo => [clo.id, clo.description, clo.bloomLevel, clo.skillType]),
    theme: 'striped',
    headStyles: { fillColor: [2, 132, 199] }, // primary color
  });

  // CLO-PLO Mapping Matrix
  doc.addPage();
  doc.setFontSize(14);
  doc.text('CLO-PLO Mapping Matrix', 14, 22);
  const ploHeaders = PLO_LIST.map(plo => plo.id);
  autoTable(doc, {
    startY: 30,
    head: [['CLO ID', ...ploHeaders]],
    body: clos.map(clo => {
      const row = [clo.id];
      const mappedPlos = mapping[clo.id] || [];
      PLO_LIST.forEach(plo => {
        row.push(mappedPlos.includes(plo.id) ? 'X' : '');
      });
      return row;
    }),
    theme: 'grid',
    headStyles: { fillColor: [2, 132, 199] },
    styles: { halign: 'center' }
  });

  // Evaluation Data
  if (evaluations.length > 0) {
      // Get the final Y from the mapping table. Let autoTable handle page breaks if needed.
      const lastY = doc.lastAutoTable?.finalY || 30;
      
      doc.setFontSize(14);
      doc.text('CLO Achievement Evaluation', 14, lastY + 15);
      autoTable(doc, {
        startY: lastY + 20,
        head: [['CLO ID', 'Description', 'Achievement (%)']],
        body: evaluations.map(ev => {
            const clo = clos.find(c => c.id === ev.cloId);
            return [ev.cloId, clo?.description || 'N/A', `${ev.achievement}%`];
        }),
        theme: 'striped',
        headStyles: { fillColor: [2, 132, 199] },
      });
  }

  doc.save(`${course.code}_CLO_Report.pdf`);
};
