import React, { useState, useEffect } from 'react';
import { Course, CLO, PloMapping, Evaluation } from '../types';
import { Card, CardHeader, CardTitle } from './ui/Card';
import { sampleCourses, SampleCourseData } from '../services/sampleData';
import { CubeIcon } from './ui/icons/Icons';
import { Alert } from './ui/Alert';

interface CourseInfoProps {
  course: Course;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
  setClos: React.Dispatch<React.SetStateAction<CLO[]>>;
  setPloMapping: React.Dispatch<React.SetStateAction<PloMapping>>;
  setEvaluations: React.Dispatch<React.SetStateAction<Evaluation[]>>;
}

export const CourseInfo: React.FC<CourseInfoProps> = ({ course, setCourse, setClos, setPloMapping, setEvaluations }) => {
  const [notification, setNotification] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: name === 'credits' ? parseInt(value) || 0 : value }));
  };
  
  const handleLoadSample = (sample: SampleCourseData) => {
    if (window.confirm('Tải dữ liệu mẫu sẽ ghi đè lên dữ liệu hiện tại của bạn. Bạn có chắc không?')) {
        setCourse(sample.course);
        setClos(sample.clos);
        setPloMapping(sample.mapping);
        setEvaluations(sample.evaluations);
        setNotification('Dữ liệu mẫu đã được tải thành công! Các trường thông tin và các trang khác đã được cập nhật với thông tin mới.');
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Khóa Học</CardTitle>
          <p className="text-slate-500 mt-1">Xác định các chi tiết cơ bản của khóa học.</p>
        </CardHeader>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Tên Khóa Học
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={course.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700">
                Mã Khóa Học
              </label>
              <input
                type="text"
                name="code"
                id="code"
                value={course.code}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label htmlFor="credits" className="block text-sm font-medium text-slate-700">
              Số Tín Chỉ
            </label>
            <input
              type="number"
              name="credits"
              id="credits"
              value={course.credits}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Mô Tả Ngắn
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              value={course.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
        </form>
      </Card>
      
      <Card>
        <CardHeader className="flex items-start gap-4">
          <CubeIcon className="w-8 h-8 text-secondary flex-shrink-0 mt-1"/>
          <div>
            <CardTitle>Bắt đầu nhanh với dữ liệu mẫu?</CardTitle>
            <p className="text-slate-500 mt-1">Tải một khóa học mẫu để khám phá các tính năng của ứng dụng.</p>
          </div>
        </CardHeader>
        {notification && <Alert message={notification} type="success" onClose={() => setNotification(null)} className="my-4" />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {sampleCourses.map((sample, index) => (
            <div key={index} className="p-4 border rounded-lg bg-slate-50 flex flex-col">
              <h3 className="font-bold text-primary">{sample.course.name}</h3>
              <p className="text-sm text-slate-600 mt-1 flex-grow">{sample.course.description}</p>
              <button
                onClick={() => handleLoadSample(sample)}
                className="mt-4 w-full px-4 py-2 bg-secondary text-white rounded-md hover:bg-slate-700 transition text-sm font-semibold"
              >
                Tải Dữ Liệu Mẫu
              </button>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};