import React, { useState, useEffect } from 'react';
import { Page, Project, Task, ChatMessage, TeamMember } from '../types';
import { getChatResponse } from '../services/geminiService';
import { Modal } from './Modal';

interface ProjectsProps {
    projects: Project[];
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    teamMembers: TeamMember[];
    chatMessages: ChatMessage[];
    setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    selectedProjectId: number | null;
    setSelectedProjectId: (id: number | null) => void;
    onNavigate: (page: Page) => void;
    onCreateProject: (project: Omit<Project, 'id' | 'score'>) => void;
}

const ProjectList: React.FC<{
    projects: Project[];
    selectedProjectId: number | null;
    onSelectProject: (id: number) => void;
}> = ({ projects, selectedProjectId, onSelectProject }) => (
    <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        <div className="space-y-2">
            {projects.map(project => (
                <div 
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedProjectId === project.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    <h3 className="font-bold">{project.name}</h3>
                    <p className="text-sm text-gray-400 truncate">{project.description}</p>
                </div>
            ))}
        </div>
    </div>
);

const TaskBoard: React.FC<{ 
    tasks: Task[];
    teamMembers: TeamMember[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}> = ({ tasks, teamMembers, setTasks }) => {
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editedTaskData, setEditedTaskData] = useState<Partial<Task>>({});

    const handleEdit = (task: Task) => {
        setEditingTaskId(task.id);
        setEditedTaskData(task);
    };

    const handleCancel = () => {
        setEditingTaskId(null);
        setEditedTaskData({});
    };

    const handleSave = () => {
        if (!editedTaskData.id) return;
        setTasks(prevTasks => prevTasks.map(t => t.id === editedTaskData.id ? editedTaskData as Task : t));
        setEditingTaskId(null);
        setEditedTaskData({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedTaskData(prev => ({ ...prev, [name]: value }));
    };


    return (
    <div className="bg-gray-800 p-6 rounded-lg mt-6">
        <h2 className="text-xl font-semibold mb-4">Task Board</h2>
        {tasks.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-700">
                            <th className="p-3 text-sm font-semibold text-gray-400">Task</th>
                            <th className="p-3 text-sm font-semibold text-gray-400">Assignee</th>
                            <th className="p-3 text-sm font-semibold text-gray-400">Status</th>
                            <th className="p-3 text-sm font-semibold text-gray-400">Due</th>
                            <th className="p-3 text-sm font-semibold text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                             <tr key={task.id} className="border-b border-gray-700 last:border-0 h-16">
                                <td className="p-3">
                                    {editingTaskId === task.id ? (
                                        <input name="title" value={editedTaskData.title || ''} onChange={handleInputChange} className="bg-gray-600 rounded px-2 py-1 w-full" />
                                    ) : (
                                        task.title
                                    )}
                                </td>
                                <td className="p-3 text-gray-300">
                                    {editingTaskId === task.id ? (
                                        <select name="assignee" value={editedTaskData.assignee || ''} onChange={handleInputChange} className="bg-gray-600 rounded px-2 py-1 w-full">
                                            {teamMembers.map(member => <option key={member.id} value={member.name}>{member.name}</option>)}
                                        </select>
                                    ) : (
                                        task.assignee
                                    )}
                                </td>
                                <td className="p-3">
                                    {editingTaskId === task.id ? (
                                        <select name="status" value={editedTaskData.status || ''} onChange={handleInputChange} className="bg-gray-600 rounded px-2 py-1 w-full">
                                            <option value="Todo">Todo</option>
                                            <option value="In progress">In progress</option>
                                            <option value="Done">Done</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            task.status === 'Done' ? 'bg-green-500/20 text-green-400' :
                                            task.status === 'In progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-gray-500/20 text-gray-300'
                                        }`}>
                                            {task.status}
                                        </span>
                                    )}
                                </td>
                                <td className="p-3 text-gray-400">{task.due}</td>
                                <td className="p-3 text-right">
                                    {editingTaskId === task.id ? (
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={handleSave} className="text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded">Save</button>
                                            <button onClick={handleCancel} className="text-sm bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded">Cancel</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleEdit(task)} className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Edit</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="text-gray-400">No tasks for this project yet.</p>
        )}
    </div>
)};

const AIChat: React.FC<{ 
    messages: ChatMessage[]; 
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}> = ({ messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg flex flex-col h-full">
            <h2 className="text-xl font-semibold p-4 border-b border-gray-700">AI Assistant</h2>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                            msg.sender === 'user' ? 'bg-blue-600 text-white' : 
                            msg.sender === 'system' ? 'bg-gray-600 text-gray-300 text-sm' : 'bg-gray-700 text-gray-200'
                        }`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && <div className="flex justify-start"><div className="p-3 rounded-lg bg-gray-700 text-gray-200">AI is thinking...</div></div>}
            </div>
            <div className="p-4 border-t border-gray-700 flex">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about your project..."
                    className="flex-1 bg-gray-700 border-gray-600 rounded-l-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-r-md">
                    Send
                </button>
            </div>
        </div>
    );
};

export const Projects: React.FC<ProjectsProps> = ({ 
    projects, tasks, setTasks, teamMembers, chatMessages, setChatMessages, 
    selectedProjectId, setSelectedProjectId, onNavigate, onCreateProject
}) => {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');
    const [newProjectStart, setNewProjectStart] = useState('');
    const [newProjectEnd, setNewProjectEnd] = useState('');
    const [isChatLoading, setChatLoading] = useState(false);

    const handleSendMessage = async (message: string) => {
        const userMessage: ChatMessage = { sender: 'user', text: message };
        setChatMessages(prev => [...prev, userMessage]);
        setChatLoading(true);

        const history = chatMessages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{text: m.text}]
        }));

        const aiResponse = await getChatResponse(history, message);
        const aiMessage: ChatMessage = { sender: 'ai', text: aiResponse };
        setChatMessages(prev => [...prev, aiMessage]);
        setChatLoading(false);
    };

    const handleCreateProjectSubmit = () => {
        if(newProjectName && newProjectDesc && newProjectStart && newProjectEnd) {
            onCreateProject({
                name: newProjectName,
                description: newProjectDesc,
                start: newProjectStart,
                end: newProjectEnd,
            });
            setCreateModalOpen(false);
            setNewProjectName('');
            setNewProjectDesc('');
            setNewProjectStart('');
            setNewProjectEnd('');
        }
    };

    const selectedProject = projects.find(p => p.id === selectedProjectId);
    const selectedProjectTasks = tasks.filter(t => t.projectId === selectedProjectId);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Projects</h1>
                <button 
                    onClick={() => setCreateModalOpen(true)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Create New Project
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
                <div className="lg:col-span-1 flex flex-col space-y-6">
                    <ProjectList 
                        projects={projects}
                        selectedProjectId={selectedProjectId}
                        onSelectProject={setSelectedProjectId}
                    />
                </div>
                <div className="lg:col-span-2 flex flex-col">
                    {selectedProject ? (
                        <div className="flex-1 min-h-0">
                             <AIChat messages={chatMessages} onSendMessage={handleSendMessage} isLoading={isChatLoading} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg">
                            <p className="text-gray-400">Select a project to see details and chat with the AI assistant.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedProject && (
                <div>
                    <h2 className="text-3xl font-bold">{selectedProject.name}</h2>
                    <p className="text-gray-400 mt-1">{selectedProject.description}</p>
                    <TaskBoard tasks={selectedProjectTasks} teamMembers={teamMembers} setTasks={setTasks} />
                </div>
            )}
            
            <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Project">
                <div className="space-y-4">
                     <input type="text" placeholder="Project Name" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} className="w-full bg-gray-700 p-2 rounded text-white" />
                     <textarea placeholder="Project Description" value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} className="w-full bg-gray-700 p-2 rounded text-white h-24" />
                     <div className="flex gap-4">
                        <input type="date" placeholder="Start Date" value={newProjectStart} onChange={e => setNewProjectStart(e.target.value)} className="w-full bg-gray-700 p-2 rounded text-white" />
                        <input type="date" placeholder="End Date" value={newProjectEnd} onChange={e => setNewProjectEnd(e.target.value)} className="w-full bg-gray-700 p-2 rounded text-white" />
                     </div>
                     <button onClick={handleCreateProjectSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Create</button>
                </div>
            </Modal>
        </div>
    );
};