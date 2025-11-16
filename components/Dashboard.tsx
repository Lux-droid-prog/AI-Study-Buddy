
import React from 'react';
import { Page, Project, Task, TeamMember } from '../types';

interface DashboardProps {
    projects: Project[];
    tasks: Task[];
    teamMembers: TeamMember[];
    onNavigate: (page: Page) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; caption: string }> = ({ title, value, caption }) => (
    <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{caption}</p>
    </div>
);

const QuickActionButton: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
    <button onClick={onClick} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg w-full text-center transition-colors">
        {children}
    </button>
);

export const Dashboard: React.FC<DashboardProps> = ({ projects, tasks, teamMembers, onNavigate }) => {
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const recentTasks = [...tasks].sort((a, b) => new Date(b.due).getTime() - new Date(a.due).getTime()).slice(0, 5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back! Here's a summary of your team's progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Projects" value={projects.length} caption="Current total projects" />
                <StatCard title="Completed Tasks" value={completedTasks} caption={`Out of ${tasks.length} total tasks`} />
                <StatCard title="Team Members" value={teamMembers.length} caption="Active collaborators" />
                <StatCard title="Upcoming Deadlines" value={tasks.filter(t => t.status !== 'Done').length} caption="Tasks to be completed" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <QuickActionButton onClick={() => onNavigate(Page.Projects)}>Create New Project</QuickActionButton>
                            <QuickActionButton onClick={() => onNavigate(Page.Projects)}>View All Projects</QuickActionButton>
                            <QuickActionButton onClick={() => onNavigate(Page.Collaboration)}>Team Collaboration</QuickActionButton>
                            <QuickActionButton onClick={() => onNavigate(Page.LearningHub)}>Learning Hub</QuickActionButton>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="p-3 text-sm font-semibold text-gray-400">Task</th>
                                    <th className="p-3 text-sm font-semibold text-gray-400">Assignee</th>
                                    <th className="p-3 text-sm font-semibold text-gray-400">Status</th>
                                    <th className="p-3 text-sm font-semibold text-gray-400">Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTasks.map(task => (
                                    <tr key={task.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700/50">
                                        <td className="p-3">{task.title}</td>
                                        <td className="p-3 text-gray-300">{task.assignee}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                task.status === 'Done' ? 'bg-green-500/20 text-green-400' :
                                                task.status === 'In progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-gray-500/20 text-gray-300'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-400">{task.due}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
