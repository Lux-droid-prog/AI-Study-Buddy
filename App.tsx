import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Projects } from './components/Projects';
import { Collaboration } from './components/Collaboration';
import { LearningHub } from './components/LearningHub';
import { Presentations } from './components/Presentations';
import { Achievements } from './components/Achievements';
import { Timeline } from './components/Timeline';
import { Team } from './components/Team';
import { Performance } from './components/Performance';
import { FocusMode } from './components/FocusMode';
import { Page, Project, Task, TeamMember, Mood, SkillProfile, Achievement, ChatMessage, Quiz, ExplanationStyle } from './types';

import { 
    PROJECTS_DATA, TASKS_DATA, TEAM_MEMBERS_DATA, MOOD_DATA, 
    SKILL_PROFILES_DATA, ACHIEVEMENTS_DATA, CHAT_MESSAGES_DATA,
    TimelineIcon, BrainCircuitIcon, AwardIcon, PresentationIcon,
    FileTextIcon, GroupIcon, HomeIcon, UserIcon, LogOutIcon, Logo
} from './constants';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);

    // Mock Data State
    const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
    const [tasks, setTasks] = useState<Task[]>(TASKS_DATA);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(TEAM_MEMBERS_DATA);
    const [moods] = useState<Mood[]>(MOOD_DATA);
    const [skillProfiles] = useState<Record<string, SkillProfile>>(SKILL_PROFILES_DATA);
    const [achievements] = useState<Achievement[]>(ACHIEVEMENTS_DATA);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(CHAT_MESSAGES_DATA);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(projects.length > 0 ? projects[0].id : null);

    const handleLogin = () => {
        setIsAuthenticated(true);
        setCurrentPage(Page.Dashboard);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const handleCreateProject = (newProject: Omit<Project, 'id' | 'score'>) => {
        setProjects(prevProjects => {
            const newId = prevProjects.length > 0 ? Math.max(...prevProjects.map(p => p.id)) + 1 : 1;
            const projectWithId: Project = { ...newProject, id: newId, score: 0 };
            return [...prevProjects, projectWithId];
        });
    };
    
    const selectedProject = projects.find(p => p.id === selectedProjectId) || null;
    
    const renderPage = () => {
        switch (currentPage) {
            case Page.Dashboard:
                return <Dashboard 
                    projects={projects} 
                    tasks={tasks} 
                    teamMembers={teamMembers} 
                    onNavigate={setCurrentPage}
                />;
            case Page.Projects:
                return <Projects 
                    projects={projects}
                    tasks={tasks}
                    setTasks={setTasks}
                    teamMembers={teamMembers}
                    chatMessages={chatMessages}
                    setChatMessages={setChatMessages}
                    selectedProjectId={selectedProjectId}
                    setSelectedProjectId={setSelectedProjectId}
                    onNavigate={setCurrentPage}
                    onCreateProject={handleCreateProject}
                />;
            case Page.Collaboration:
                return <Collaboration 
                    moods={moods} 
                    skillProfiles={skillProfiles}
                    projects={projects}
                    tasks={tasks}
                    teamMembers={teamMembers}
                    selectedProjectId={selectedProjectId}
                />;
            case Page.Team:
                return <Team
                    teamMembers={teamMembers}
                    setTeamMembers={setTeamMembers}
                />;
            case Page.Timeline:
                 return <Timeline projects={projects} />;
            case Page.LearningHub:
                return <LearningHub projects={projects} />;
            case Page.Presentations:
                return <Presentations projects={projects} selectedProject={selectedProject}/>;
            case Page.Achievements:
                return <Achievements achievements={achievements} projects={projects} />;
            case Page.Performance:
                return <Performance tasks={tasks} teamMembers={teamMembers} />;
            case Page.FocusMode:
                return <FocusMode teamMembers={teamMembers} />;
            default:
                return <Dashboard projects={projects} tasks={tasks} teamMembers={teamMembers} onNavigate={setCurrentPage} />;
        }
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
            <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;