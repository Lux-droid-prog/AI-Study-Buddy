import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Mood, SkillProfile, Project, Task, TeamMember } from '../types';
import { analyzeTeamMood, mediateConflict } from '../services/geminiService';

interface CollaborationProps {
    moods: Mood[];
    skillProfiles: Record<string, SkillProfile>;
    projects: Project[];
    tasks: Task[];
    teamMembers: TeamMember[];
    selectedProjectId: number | null;
}

const MoodTracker: React.FC<{ moods: Mood[] }> = ({ moods }) => {
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getAnalysis = useCallback(async () => {
        if (moods.length === 0) {
            setAnalysis('No mood data available to analyze.');
            return;
        }
        setIsLoading(true);
        const result = await analyzeTeamMood(moods);
        setAnalysis(result);
        setIsLoading(false);
    }, [moods]);

    useEffect(() => {
        getAnalysis();
    }, [getAnalysis]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Mood & Energy Tracker</h2>
            <p className="text-sm text-gray-400 mb-4">Track team energy and adjust workload accordingly.</p>
            <div className="space-y-3 mb-4">
                {moods.length > 0 ? moods.map(mood => (
                    <div key={mood.member} className="flex items-center bg-gray-700 p-3 rounded-lg">
                        <span className="text-2xl mr-4">{mood.mood}</span>
                        <div className="flex-1">
                            <p className="font-semibold">{mood.member} <span className="text-xs text-gray-400">(Energy: {mood.energy}/10)</span></p>
                            <p className="text-sm text-gray-300">{mood.note}</p>
                        </div>
                    </div>
                )) : (
                    <p className="text-gray-400 italic">No mood data available for the current selection.</p>
                )}
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">AI Analysis</h4>
                <p className="text-sm text-gray-300">{isLoading ? 'Analyzing...' : analysis}</p>
            </div>
        </div>
    );
};

// FIX: Changed from Object.entries to Object.keys to fix type inference issue.
const SkillAnalyzer: React.FC<{ skillProfiles: Record<string, SkillProfile> }> = ({ skillProfiles }) => (
    <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Skill & Strength Analyzer</h2>
        <p className="text-sm text-gray-400 mb-4">AI-powered role recommendations based on skills.</p>
        <div className="space-y-3">
             {Object.keys(skillProfiles).length > 0 ? Object.keys(skillProfiles).map((member) => (
                <div key={member} className="bg-gray-700 p-4 rounded-lg">
                    <p className="font-bold text-lg">{member} - <span className="font-normal text-blue-400">{skillProfiles[member].role}</span></p>
                    <p className="text-sm text-gray-300 mt-1">Strengths: {skillProfiles[member].strengths.join(', ')}</p>
                </div>
            )) : (
                <p className="text-gray-400 italic">No skill profiles available for the current selection.</p>
            )}
        </div>
    </div>
);

const ConflictMediator: React.FC = () => {
    const [conversation, setConversation] = useState('');
    const [result, setResult] = useState<{ analysis: string, suggestion: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!conversation.trim()) return;
        setIsLoading(true);
        const res = await mediateConflict(conversation);
        setResult(res);
        setIsLoading(false);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Real-Time Conflict Mediator</h2>
            <p className="text-sm text-gray-400 mb-4">AI detects conflicts and suggests mediations. Paste a conversation below.</p>
            <textarea
                value={conversation}
                onChange={(e) => setConversation(e.target.value)}
                placeholder="Paste conversation text here..."
                className="w-full h-32 bg-gray-700 p-3 rounded-md text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500">
                {isLoading ? 'Analyzing...' : 'Analyze for Conflict'}
            </button>
            {result && (
                <div className="mt-4 space-y-3">
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-400 mb-1">AI Analysis</h4>
                        <p className="text-sm text-gray-300">{result.analysis}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-400 mb-1">Suggested Response</h4>
                        <p className="text-sm text-gray-300">{result.suggestion}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Collaboration: React.FC<CollaborationProps> = ({ moods, skillProfiles, projects, tasks, teamMembers, selectedProjectId }) => {
    const selectedProject = projects.find(p => p.id === selectedProjectId);

    const { filteredMoods, filteredSkillProfiles, hasProjectMembers } = useMemo(() => {
        if (selectedProjectId) {
            const projectTasks = tasks.filter(task => task.projectId === selectedProjectId);
            // FIX: Use reduce and Object.keys to create a unique list of member names to ensure correct type inference.
            const memberNames = Object.keys(
                projectTasks.reduce((acc: Record<string, boolean>, task) => {
                    acc[task.assignee] = true;
                    return acc;
                }, {})
            );

            if (memberNames.length > 0) {
                const fMoods = moods.filter(mood => memberNames.includes(mood.member));
                const fSkills: Record<string, SkillProfile> = {};
                memberNames.forEach(member => {
                    if (skillProfiles[member]) {
                        fSkills[member] = skillProfiles[member];
                    }
                });
                return { filteredMoods: fMoods, filteredSkillProfiles: fSkills, hasProjectMembers: true };
            } else {
                return { filteredMoods: [], filteredSkillProfiles: {}, hasProjectMembers: false };
            }
        }
        // No project selected, return all data
        return { filteredMoods: moods, filteredSkillProfiles: skillProfiles, hasProjectMembers: true };
    }, [selectedProjectId, tasks, moods, skillProfiles]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold">Collaboration Tools</h1>
                {selectedProject ? (
                    <p className="text-gray-400 mt-1">Showing collaboration data for project: <span className="font-semibold text-white">{selectedProject.name}</span></p>
                ) : (
                    <p className="text-gray-400 mt-1">Showing data for all team members. Select a project to filter.</p>
                )}
            </div>

            {selectedProjectId && !hasProjectMembers ? (
                 <div className="bg-gray-800 p-6 rounded-lg text-center">
                    <p className="text-gray-300 text-lg">No Team Members Assigned</p>
                    <p className="text-gray-400 mt-2">Assign tasks on the Projects page to view collaboration insights for this project.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <MoodTracker moods={filteredMoods} />
                        <ConflictMediator />
                    </div>
                    <div className="space-y-8">
                        <SkillAnalyzer skillProfiles={filteredSkillProfiles} />
                    </div>
                </div>
            )}
        </div>
    );
};