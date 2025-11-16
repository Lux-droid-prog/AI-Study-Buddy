import React, { useState, useMemo } from 'react';
import { TeamMember } from '../types';
import { Modal } from './Modal';

interface TeamProps {
    teamMembers: TeamMember[];
    setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

const emptyFormState = {
    id: '',
    name: '',
    email: '',
    course: '',
    major: '',
    password: ''
};

export const Team: React.FC<TeamProps> = ({ teamMembers, setTeamMembers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Partial<TeamMember> & { password?: string } | null>(null);

    const handleOpenCreateModal = () => {
        setEditingMember(emptyFormState);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (member: TeamMember) => {
        setEditingMember({ ...member, password: '' }); // Don't expose existing passwords
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingMember(null);
        setIsModalOpen(false);
    };

    const handleSaveMember = () => {
        if (!editingMember) return;

        if (editingMember.id) { // Update existing member
            setTeamMembers(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...editingMember } as TeamMember : m));
        } else { // Create new member
            const newMember: TeamMember = {
                id: `u${Date.now()}`, // simple unique ID
                name: editingMember.name || '',
                email: editingMember.email || '',
                course: editingMember.course || '',
                major: editingMember.major || '',
            };
            setTeamMembers(prev => [...prev, newMember]);
        }
        handleCloseModal();
    };

    const handleDeleteMember = (id: string) => {
        // Add confirmation dialog in a real app
        setTeamMembers(prev => prev.filter(m => m.id !== id));
    };
    
    const isEditing = useMemo(() => editingMember && editingMember.id, [editingMember]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Team Management</h1>
                <button 
                    onClick={handleOpenCreateModal} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Create New Member
                </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-3 text-sm font-semibold text-gray-400">Name</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Email</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Course</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Major</th>
                                <th className="p-3 text-sm font-semibold text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamMembers.map(member => (
                                <tr key={member.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700/50">
                                    <td className="p-3 font-medium">{member.name}</td>
                                    <td className="p-3 text-gray-300">{member.email}</td>
                                    <td className="p-3 text-gray-400">{member.course}</td>
                                    <td className="p-3 text-gray-400">{member.major}</td>
                                    <td className="p-3 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => handleOpenEditModal(member)} className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Edit</button>
                                            <button onClick={() => handleDeleteMember(member.id)} className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Edit Team Member" : "Create New Team Member"}>
                {editingMember && (
                    <div className="space-y-4">
                        <input type="text" placeholder="Full Name" value={editingMember.name} onChange={e => setEditingMember(m => ({...m, name: e.target.value}))} className="w-full bg-gray-700 p-2 rounded text-white" />
                        <input type="email" placeholder="Email Address" value={editingMember.email} onChange={e => setEditingMember(m => ({...m, email: e.target.value}))} className="w-full bg-gray-700 p-2 rounded text-white" />
                        <input type="text" placeholder="Course" value={editingMember.course} onChange={e => setEditingMember(m => ({...m, course: e.target.value}))} className="w-full bg-gray-700 p-2 rounded text-white" />
                        <input type="text" placeholder="Major" value={editingMember.major} onChange={e => setEditingMember(m => ({...m, major: e.target.value}))} className="w-full bg-gray-700 p-2 rounded text-white" />
                        {!isEditing && (
                             <input type="password" placeholder="Set Initial Password" value={editingMember.password} onChange={e => setEditingMember(m => ({...m, password: e.target.value}))} className="w-full bg-gray-700 p-2 rounded text-white" />
                        )}
                        <button onClick={handleSaveMember} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                            {isEditing ? "Save Changes" : "Create Member"}
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};