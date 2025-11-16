
import React from 'react';
import { Project } from '../types';

interface TimelineProps {
    projects: Project[];
}

export const Timeline: React.FC<TimelineProps> = ({ projects }) => {
    
    if (projects.length === 0) {
        return (
             <div>
                <h1 className="text-4xl font-bold mb-2">Project Timeline</h1>
                 <p className="text-gray-400">No projects to display on the timeline.</p>
             </div>
        );
    }
    
    const projectDates = projects.map(p => [new Date(p.start), new Date(p.end)]).flat();
    const minDate = new Date(Math.min(...projectDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...projectDates.map(d => d.getTime())));

    minDate.setDate(1); // Start of the month
    maxDate.setMonth(maxDate.getMonth() + 1, 0); // End of the month

    const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24);
    
    const getMonths = () => {
        const months = [];
        let currentDate = new Date(minDate);
        while (currentDate <= maxDate) {
            months.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return months;
    };
    
    const months = getMonths();

    const calculateBar = (project: Project) => {
        const startDate = new Date(project.start);
        const endDate = new Date(project.end);

        const leftOffset = ((startDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24) / totalDays) * 100;
        const width = ((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) / totalDays) * 100;

        return { left: `${leftOffset}%`, width: `${width}%` };
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold mb-2">Project Timeline</h1>
            <div className="bg-gray-800 p-6 rounded-lg">
                <div className="relative">
                    {/* Months header */}
                    <div className="relative flex border-b-2 border-gray-600 mb-4">
                        {months.map((month, index) => (
                            <div key={index} className="flex-1 text-center py-2 text-sm font-semibold text-gray-300">
                                {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </div>
                        ))}
                    </div>

                    {/* Project Rows */}
                    <div className="space-y-4">
                        {projects.map((project, index) => {
                            const { left, width } = calculateBar(project);
                            return (
                                <div key={project.id} className="flex items-center h-12">
                                    <div className="w-48 pr-4 text-right text-sm font-medium truncate">{project.name}</div>
                                    <div className="flex-1 bg-gray-700 rounded-full h-8 relative">
                                        <div 
                                            className={`absolute h-8 rounded-full bg-blue-500 flex items-center justify-center px-2`}
                                            style={{ left, width }}
                                        >
                                           <span className="text-xs font-bold text-white truncate">{project.name}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
