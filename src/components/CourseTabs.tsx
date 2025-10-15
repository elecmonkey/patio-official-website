import { useState } from 'react';

interface Course {
  tag: string;
  title: string;
  subtitle?: string;
  instructor?: string;
  description?: string;
  bgColor?: string;
}

interface CourseTabsProps {
  tabs: string[];
  courses: Course[];
  initialTab?: number;
  type?: 'system' | 'certification';
}

export default function CourseTabs({ tabs, courses, initialTab = 0, type = 'system' }: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [animationKey, setAnimationKey] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setAnimationKey(prev => prev + 1);
  };

  return (
    <>
      <div role="tablist" className="tabs tabs-border justify-center mb-12">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            className={`tab ${activeTab === index ? 'tab-active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div key={animationKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {courses.map((course, index) => (
          <div
            key={index}
            className="card card-border bg-base-100 overflow-hidden hover:shadow-xl transition-shadow"
            style={{animation: `slideInFromLeft 0.6s ease-out ${0.1 + index * 0.15}s both`}}
          >
            {type === 'system' ? (
              <>
                <div className={`${course.bgColor} h-48 sm:h-56 relative overflow-hidden flex items-center justify-center p-6`}>
                  <div className="text-center">
                    <div className="badge badge-ghost bg-base-100 text-base-content mb-4">
                      {course.tag}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-primary-content leading-tight">
                      {course.title}
                    </h3>
                  </div>
                </div>
                <div className="card-body">
                  <h4 className="card-title text-base sm:text-lg">
                    {course.subtitle}
                  </h4>
                  <p className="text-sm opacity-70">
                    {course.instructor}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-neutral h-48 sm:h-56 relative overflow-hidden flex items-center justify-center p-6">
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-neutral-content"
                        style={{top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`}}
                      />
                    ))}
                  </div>
                  <div className="text-center relative z-10">
                    <div className="badge badge-ghost bg-base-100 text-base-content mb-4">
                      {course.tag}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-content leading-tight">
                      {course.title}
                    </h3>
                  </div>
                </div>
                <div className="card-body">
                  <p className="text-sm text-center opacity-70">
                    {course.description}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
