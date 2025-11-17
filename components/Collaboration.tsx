import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Mood, SkillProfile, Project, Task, TeamMember } from '../types';
import { analyzeTeamMood, mediateConflict } from '../services/geminiService';
import { WhiteboardIcon, EraserIcon } from '../constants';


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


// --- START OF NEW WHITEBOARD CODE ---

// Sub-component for the toolbar on the left
const Toolbar: React.FC<{
    color: string;
    setColor: (color: string) => void;
    size: number;
    setSize: (size: number) => void;
    tool: 'pen' | 'eraser';
    setTool: (tool: 'pen' | 'eraser') => void;
    clearCanvas: () => void;
}> = ({ color, setColor, size, setSize, tool, setTool, clearCanvas }) => {
    const colors = ['#FFFFFF', '#3b82f6', '#ef4444', '#22c55e', '#f97316', '#facc15'];
    const sizes = [2, 5, 10, 20];

    return (
        <div className="w-24 bg-gray-800 rounded-lg p-4 flex flex-col items-center shadow-lg">
            <h3 className="text-sm font-semibold mb-4 text-gray-300">Color</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
                {colors.map((c) => (
                    <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full transition-transform duration-150 ${color === c ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white scale-110' : ''}`}
                        style={{ backgroundColor: c }}
                        aria-label={`Select color ${c}`}
                    />
                ))}
            </div>
            <h3 className="text-sm font-semibold mb-4 text-gray-300">Size</h3>
            <div className="space-y-3 mb-6">
                {sizes.map((s) => (
                    <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${size === s ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                        aria-label={`Select size ${s}`}
                    >
                        <div className="bg-white rounded-full" style={{ width: s, height: s }} />
                    </button>
                ))}
            </div>
            <h3 className="text-sm font-semibold mb-4 text-gray-300">Tools</h3>
            <div className="space-y-3">
                <button
                    onClick={() => setTool('pen')}
                    className={`p-2 rounded-lg transition-colors ${tool === 'pen' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                    title="Pen"
                >
                    <WhiteboardIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={() => setTool('eraser')}
                    className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                    title="Eraser"
                >
                    <EraserIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={clearCanvas}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                    title="Clear Canvas"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        </div>
    );
};

// Sub-component for the team panel on the right
const TeamAccessPanel: React.FC<{ teamMembers: TeamMember[] }> = ({ teamMembers }) => {
    const [accessList, setAccessList] = useState<string[]>(['Lakshiya', 'Sravya']);
    const drawingNow = ['Lakshiya', 'Sravya'];

    const grantAccess = (name: string) => setAccessList(prev => [...prev, name]);
    const revokeAccess = (name: string) => setAccessList(prev => prev.filter(n => n !== name));

    const membersWithAccess = teamMembers.filter(m => accessList.includes(m.name));
    const membersWithoutAccess = teamMembers.filter(m => !accessList.includes(m.name));

    return (
        <div className="w-72 bg-gray-800 rounded-lg p-4 flex flex-col shadow-lg">
            <h2 className="text-lg font-bold mb-4">Team & Access</h2>
            
            <h3 className="text-sm font-semibold text-blue-400 mb-2">Drawing Now ({drawingNow.length})</h3>
            <div className="space-y-2 mb-6">
                {drawingNow.map(name => (
                    <div key={name} className="text-gray-300">{name}</div>
                ))}
            </div>
            
            <div className="border-t border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Manage Access</h3>
                <div className="space-y-2">
                    {membersWithAccess.map(member => (
                        <div key={member.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                            <span>{member.name}</span>
                            <button onClick={() => revokeAccess(member.name)} className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full">Revoke</button>
                        </div>
                    ))}
                     {membersWithoutAccess.map(member => (
                        <div key={member.id} className="flex items-center justify-between bg-gray-900/50 p-2 rounded-md">
                            <span>{member.name}</span>
                            <button onClick={() => grantAccess(member.name)} className="text-xs bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-full">Grant</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


interface WhiteboardProps {
    teamMembers: TeamMember[];
}

export const Whiteboard: React.FC<WhiteboardProps> = ({ teamMembers }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#FFFFFF');
    const [size, setSize] = useState(5);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

    const setCanvasDimensions = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const { width, height } = canvas.getBoundingClientRect();
            if (canvas.width !== width || canvas.height !== height) {
                const context = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                if(context){
                    context.lineCap = 'round';
                    context.strokeStyle = color;
                    context.lineWidth = size;
                    contextRef.current = context;
                }
            }
        }
    }, [color, size]);


    useEffect(() => {
        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);
        return () => window.removeEventListener('resize', setCanvasDimensions);
    }, [setCanvasDimensions]);
    
    useEffect(() => {
        if(contextRef.current){
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = size;
            contextRef.current.globalCompositeOperation = tool === 'pen' ? 'source-over' : 'destination-out';
        }
    }, [color, size, tool]);


    const getCoords = (event: React.MouseEvent | React.TouchEvent): { x: number, y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in event.nativeEvent) {
            if (event.nativeEvent.touches.length === 0) return null;
            clientX = event.nativeEvent.touches[0].clientX;
            clientY = event.nativeEvent.touches[0].clientY;
        } else {
            clientX = event.nativeEvent.clientX;
            clientY = event.nativeEvent.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        const coords = getCoords(event);
        if (!coords || !contextRef.current) return;
        
        contextRef.current.beginPath();
        contextRef.current.moveTo(coords.x, coords.y);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        if (!contextRef.current) return;
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const coords = getCoords(event);
        if (!coords || !contextRef.current) return;

        contextRef.current.lineTo(coords.x, coords.y);
        contextRef.current.stroke();
    };
    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if(canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    return (
        <div className="flex h-full flex-col">
            <h1 className="text-3xl font-bold mb-4">Collaborative Whiteboard</h1>
            <div className="flex-1 flex gap-4 min-h-0">
                <Toolbar color={color} setColor={setColor} size={size} setSize={setSize} tool={tool} setTool={setTool} clearCanvas={clearCanvas}/>
                <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden shadow-inner">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full bg-[#1F2937]"
                        onMouseDown={startDrawing}
                        onMouseUp={finishDrawing}
                        onMouseMove={draw}
                        onMouseLeave={finishDrawing}
                        onTouchStart={startDrawing}
                        onTouchEnd={finishDrawing}
                        onTouchMove={draw}
                    />
                </div>
                <TeamAccessPanel teamMembers={teamMembers} />
            </div>
        </div>
    );
};