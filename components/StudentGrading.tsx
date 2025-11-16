
import React, { useState } from 'react';
import { Task, Project, TeamMember } from '../types';
import { Modal } from './Modal';

interface StudentGradingProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    projects: Project[];
    teamMembers: TeamMember[];
}

const emptyTaskState: Omit<Task, 'id'> = {
    projectId: 0,
    title: '',
    assignee: '',
    status: 'Todo',
    due: '',
};

export const StudentGrading: React.FC<StudentGradingProps> = ({ tasks, setTasks, projects, teamMembers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskData, setNewTaskData] = useState<Omit<Task, 'id'>>(emptyTaskState);

    const handleOpenCreateModal = () => {
        setNewTaskData({
            ...emptyTaskState,
            projectId: projects.length > 0 ? projects[0].id : 0,
            assignee: teamMembers.length > 0 ? teamMembers[0].name : '',
            due: new Date().toISOString().split('T')[0], // default to today
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewTaskData(emptyTaskState);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTaskData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateTask = () => {
        if (!newTaskData.title || !newTaskData.projectId || !newTaskData.assignee || !newTaskData.due) {
            // Add some user feedback here in a real app
            console.error("All fields are required");
            return;
        }

        const newTask: Task = {
            id: Date.now(), // simple unique ID
            ...newTaskData,
            projectId: Number(newTaskData.projectId),
        };
        
        setTasks(prev => [...prev, newTask].sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime()));
        handleCloseModal();
    };
    
    const getProjectName = (projectId: number) => {
        return projects.find(p => p.id === projectId)?.name || 'Unknown Project';
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Student Grading</h1>
                <button 
                    onClick={handleOpenCreateModal} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Create New Task
                </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
                 <h2 className="text-xl font-semibold mb-4">Task Board</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-3 text-sm font-semibold text-gray-400">Task</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Project</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Assignee</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Status</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700/50">
                                    <td className="p-3">{task.title}</td>
                                    <td className="p-3 text-gray-400">{getProjectName(task.projectId)}</td>
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

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create New Task">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="project-select" className="block text-sm font-medium text-gray-300 mb-1">Project</label>
                        <select id="project-select" name="projectId" value={newTaskData.projectId} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded text-white">
                             {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="task-title" className="block text-sm font-medium text-gray-300 mb-1">Task Title</label>
                        <input id="task-title" type="text" name="title" placeholder="e.g., Literature Review" value={newTaskData.title} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded text-white" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="assignee-select" className="block text-sm font-medium text-gray-300 mb-1">Assignee</label>
                             <select id="assignee-select" name="assignee" value={newTaskData.assignee} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded text-white">
                                {teamMembers.map(member => <option key={member.id} value={member.name}>{member.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status-select" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                             <select id="status-select" name="status" value={newTaskData.status} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded text-white">
                                <option value="Todo">Todo</option>
                                <option value="In progress">In progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="due-date" className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                        <input id="due-date" type="date" name="due" value={newTaskData.due} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded text-white" />
                    </div>
                     <button onClick={handleCreateTask} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-2">
                        Create Task
                    </button>
                </div>
            </Modal>
        </div>
    );
};