import React, { useState, useEffect, useMemo } from 'react';
import { Task, TeamMember } from '../types';
import { summarizeContributions } from '../services/geminiService';

interface PerformanceProps {
    tasks: Task[];
    teamMembers: TeamMember[];
}

const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-orange-500'];
const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#14b8a6', '#ec4899', '#f97316'];


const WorkloadChart: React.FC<{ data: { name: string, taskCount: number }[] }> = ({ data }) => {
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
    const totalTasks = useMemo(() => data.reduce((sum, item) => sum + item.taskCount, 0), [data]);

    const pieChartStyle = useMemo(() => {
        const gradients = data.reduce((acc, member, index) => {
                const percentage = totalTasks > 0 ? (member.taskCount / totalTasks) * 100 : 0;
                if (percentage > 0) {
                    acc.sections.push(`${CHART_COLORS[index % CHART_COLORS.length]} ${acc.currentPercentage}% ${acc.currentPercentage + percentage}%`);
                }
                acc.currentPercentage += percentage;
                return acc;
            }, { sections: [], currentPercentage: 0 }).sections.join(', ');
        
        return {
            background: `conic-gradient(${gradients})`,
        };
    }, [data, totalTasks]);


    const maxTasks = useMemo(() => Math.max(...data.map(d => d.taskCount), 1), [data]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg min-h-[420px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Workload Distribution</h2>
                <div className="flex bg-gray-700 rounded-lg p-1">
                    <button onClick={() => setChartType('bar')} className={`px-3 py-1 text-sm rounded-md transition-colors ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-600'}`}>Bar</button>
                    <button onClick={() => setChartType('pie')} className={`px-3 py-1 text-sm rounded-md transition-colors ${chartType === 'pie' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-600'}`}>Pie</button>
                </div>
            </div>

            <div className="h-72">
                {chartType === 'bar' ? (
                     <div className="flex justify-around items-end h-full space-x-2 md:space-x-4" aria-label="Workload distribution bar chart" role="figure">
                       {data.map((member, index) => (
                            <div key={member.name} className="flex-1 flex flex-col items-center justify-end h-full">
                                 <span className="text-sm font-bold text-white mb-1">{member.taskCount}</span>
                                <div 
                                    className={`w-3/4 max-w-[60px] ${COLORS[index % COLORS.length]} rounded-t-lg transition-all duration-500 ease-in-out hover:opacity-80`}
                                    style={{ height: `${(member.taskCount / maxTasks) * 100}%` }}
                                    title={`${member.name}: ${member.taskCount} tasks`}
                                ></div>
                                <p className="text-sm font-medium text-center truncate mt-2 w-full">{member.name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-full">
                        <div 
                            className="w-48 h-48 rounded-full" 
                            style={pieChartStyle}
                            role="img"
                            aria-label={`Pie chart showing task distribution: ${data.map(m => `${m.name} ${totalTasks > 0 ? ((m.taskCount/totalTasks)*100).toFixed(1) : 0}%`).join(', ')}`}
                        ></div>
                        <div className="flex flex-col space-y-2">
                            {data.map((member, index) => (
                                <div key={member.name} className="flex items-center">
                                    <div className={`w-4 h-4 rounded-sm mr-3 ${COLORS[index % COLORS.length]}`}></div>
                                    <span>{member.name} - {member.taskCount} tasks ({totalTasks > 0 ? ((member.taskCount / totalTasks) * 100).toFixed(1) : 0}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const MemberContribution: React.FC<{ member: TeamMember, memberTasks: Task[] }> = ({ member, memberTasks }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const taskStats = useMemo(() => {
        return {
            total: memberTasks.length,
            done: memberTasks.filter(t => t.status === 'Done').length,
            inProgress: memberTasks.filter(t => t.status === 'In progress').length,
            todo: memberTasks.filter(t => t.status === 'Todo').length,
        };
    }, [memberTasks]);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            const result = await summarizeContributions(member.name, memberTasks);
            setSummary(result);
            setIsLoading(false);
        };
        fetchSummary();
    }, [member.name, memberTasks]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">{member.name}</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
                <div className="bg-gray-700 p-3 rounded-md">
                    <p className="text-2xl font-bold">{taskStats.total}</p>
                    <p className="text-xs text-gray-400">Total Tasks</p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-md">
                    <p className="text-2xl font-bold text-green-400">{taskStats.done}</p>
                    <p className="text-xs text-gray-400">Done</p>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-md">
                    <p className="text-2xl font-bold text-yellow-400">{taskStats.inProgress}</p>
                    <p className="text-xs text-gray-400">In Progress</p>
                </div>
                 <div className="bg-gray-500/20 p-3 rounded-md">
                    <p className="text-2xl font-bold text-gray-300">{taskStats.todo}</p>
                    <p className="text-xs text-gray-400">To-do</p>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-blue-400 mb-2">AI Contribution Summary</h4>
                <div className="bg-gray-900/50 p-4 rounded-lg min-h-[100px]">
                    <p className="text-sm text-gray-300">
                        {isLoading ? 'Generating summary...' : summary}
                    </p>
                </div>
            </div>
        </div>
    );
};


export const Performance: React.FC<PerformanceProps> = ({ tasks, teamMembers }) => {
    const workloadData = useMemo(() => {
        return teamMembers.map(member => ({
            name: member.name,
            taskCount: tasks.filter(task => task.assignee === member.name).length
        }));
    }, [tasks, teamMembers]);
    
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Performance Analytics</h1>
            
            <WorkloadChart data={workloadData} />
            
            <div>
                <h2 className="text-2xl font-semibold mb-4">Member Contributions</h2>
                <div className="space-y-6">
                    {teamMembers.map(member => (
                        <MemberContribution 
                            key={member.id}
                            member={member}
                            memberTasks={tasks.filter(t => t.assignee === member.name)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};