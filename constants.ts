import React from 'react';
import { Project, Task, TeamMember, Mood, SkillProfile, Achievement, ChatMessage } from './types';

export const PROJECTS_DATA: Project[] = [
    { id: 1, name: "AI Research Initiative", description: "Develop a novel NLP model for sentiment analysis on financial news.", start: "2025-01-05", end: "2025-02-28", score: 72 },
    { id: 2, name: "Robotics Arm Project", description: "Build and program a line-following robot for warehouse automation.", start: "2025-01-15", end: "2025-03-10", score: 85 },
    { id: 3, name: "Project Test", description: "A test project with editable tasks.", start: "2025-03-01", end: "2025-04-01", score: 0 },
    { id: 4, name: "Student Grading Project", description: "A project to develop a system for automated student grading.", start: "2025-04-10", end: "2025-05-15", score: 0 },
];

export const TASKS_DATA: Task[] = [
    { id: 101, projectId: 1, title: "Data acquisition and cleanup", assignee: "Ava", status: "In progress", due: "2025-01-20" },
    { id: 102, projectId: 1, title: "Establish baseline model architecture", assignee: "Ben", status: "Todo", due: "2025-01-25" },
    { id: 103, projectId: 1, title: "Literature Review on Transformers", assignee: "Ava", status: "Done", due: "2025-01-15" },
    { id: 201, projectId: 2, title: "Design chassis in CAD software", assignee: "Cara", status: "Done", due: "2025-01-18" },
    { id: 202, projectId: 2, title: "Source and order electronic components", assignee: "Diego", status: "In progress", due: "2025-01-22" },
    { id: 301, projectId: 3, title: "Editable Task 1", assignee: "Ava", status: "Todo", due: "2025-03-05" },
    { id: 302, projectId: 3, title: "Editable Task 2", assignee: "Ben", status: "Todo", due: "2025-03-10" },
    { id: 303, projectId: 3, title: "Editable Task 3", assignee: "Cara", status: "In progress", due: "2025-03-15" },
    { id: 304, projectId: 3, title: "Editable Task 4", assignee: "Diego", status: "Done", due: "2025-03-20" },
    { id: 305, projectId: 3, title: "Editable Task 5", assignee: "Ava", status: "Todo", due: "2025-03-25" },
];

export const TEAM_MEMBERS_DATA: TeamMember[] = [
    { id: "u1", name: "Ava", email: "ava@example.com", course: "Computer Science", major: "AI & Machine Learning" },
    { id: "u2", name: "Ben", email: "ben@example.com", course: "Computer Science", major: "Software Engineering" },
    { id: "u3", name: "Cara", email: "cara@example.com", course: "Mechanical Engineering", major: "Robotics" },
    { id: "u4", name: "Diego", email: "diego@example.com", course: "Business Administration", major: "Project Management" },
];

export const MOOD_DATA: Mood[] = [
    { member: "Ava", mood: "🙂", energy: 7, note: "Feeling productive after finishing the literature review." },
    { member: "Ben", mood: "😓", energy: 4, note: "A bit overloaded with the new model architecture." },
    { member: "Cara", mood: "😎", energy: 8, note: "Chassis design was a breeze, ready for the next challenge." },
    { member: "Diego", mood: "🤔", energy: 6, note: "Thinking about the best component suppliers." }
];

export const SKILL_PROFILES_DATA: Record<string, SkillProfile> = {
    "Ava": { strengths: ["Research", "Academic Writing", "Data Analysis"], role: "Lead Researcher" },
    "Ben": { strengths: ["Python", "Machine Learning", "PyTorch"], role: "ML Engineer" },
    "Cara": { strengths: ["3D Modeling", "CAD/CAM", "Mechanical Design"], role: "Hardware Designer" },
    "Diego": { strengths: ["Logistics", "Project Planning", "Communication"], role: "Project Coordinator" },
};

export const ACHIEVEMENTS_DATA: Achievement[] = [
    { badge: "Fast Finisher", owner: "Ava" },
    { badge: "The Motivator", owner: "Diego" },
    { badge: "Creative Mind", owner: "Cara" },
];

export const CHAT_MESSAGES_DATA: ChatMessage[] = [
    { sender: 'system', scope: 'group', text: 'Welcome to the AI Research Initiative chat!' }
];

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
        React.createElement('polyline', { points: "9 22 9 12 15 12 15 22" })
    )
);

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
export const GroupIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "M3 7V5a2 2 0 0 1 2-2h2" }),
        React.createElement('path', { d: "M17 3h2a2 2 0 0 1 2 2v2" }),
        React.createElement('path', { d: "M21 17v2a2 2 0 0 1-2 2h-2" }),
        React.createElement('path', { d: "M7 21H5a2 2 0 0 1-2-2v-2" }),
        React.createElement('rect', { width: "7", height: "5", x: "7", y: "7", rx: "1" }),
        React.createElement('rect', { width: "7", height: "5", x: "10", y: "12", rx: "1" })
    )
);

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
export const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
        React.createElement('polyline', { points: "14 2 14 8 20 8" }),
        React.createElement('line', { x1: "16", y1: "13", x2: "8", y2: "13" }),
        React.createElement('line', { x1: "16", y1: "17", x2: "8", y2: "17" }),
        React.createElement('line', { x1: "10", y1: "9", x2: "8", y2: "9" })
    )
);

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
export const PresentationIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "M2 3h20" }),
        React.createElement('path', { d: "M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" }),
        React.createElement('path', { d: "m7 21 5-5 5 5" })
    )
);

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
export const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('circle', { cx: "12", cy: "8", r: "6" }),
        React.createElement('path', { d: "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" })
    )
);

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
export const BrainCircuitIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "M12 5a3 3 0 1 0-5.993.142" }),
        React.createElement('path', { d: "M18 12a3 3 0 1 0-4 2.828" }),
        React.createElement('path', { d: "M12 19a3 3 0 1 0-5.993-.142" }),
        React.createElement('path', { d: "M18 5a3 3 0 1 0-4-2.828" }),
        React.createElement('path', { d: "M6 12a3 3 0 1 0 .007 0z" }),
        React.createElement('path', { d: "M14.5 14.5 12 12l2.5-2.5" }),
        React.createElement('path', { d: "m9.5 9.5 2.5 2.5-2.5 2.5" }),
        React.createElement('path', { d: "M14.5 6.5 12 9l2.5 2.5" }),
        React.createElement('path', { d: "m9.5 14.5 2.5-2.5-2.5-2.5" })
    )
);

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
export const TimelineIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "M4 4v2" }),
        React.createElement('path', { d: "M8 4v2" }),
        React.createElement('path', { d: "M4 10h16" }),
        React.createElement('path', { d: "M12 4v2" }),
        React.createElement('path', { d: "M16 4v2" }),
        React.createElement('path', { d: "M20 4v2" }),
        React.createElement('path', { d: "M4 14h12" }),
        React.createElement('path', { d: "M4 18h6" })
    )
);

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
        React.createElement('circle', { cx: "12", cy: "7", r: "4" })
    )
);

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
export const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props },
        React.createElement('path', { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
        React.createElement('polyline', { points: "16 17 21 12 16 7" }),
        React.createElement('line', { x1: "21", y1: "12", x2: "9", y2: "12" })
    )
);

// FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { viewBox: "0 0 100 100", xmlns: "http://www.w3.org/2000/svg", ...props },
        React.createElement('defs', null,
            React.createElement('linearGradient', { id: "logoGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
                React.createElement('stop', { offset: "0%", style: { stopColor: '#3b82f6', stopOpacity: 1 } }),
                React.createElement('stop', { offset: "100%", style: { stopColor: '#8b5cf6', stopOpacity: 1 } })
            )
        ),
        React.createElement('path', { fill: "url(#logoGradient)", d: "M50,5 C74.85,5 95,25.15 95,50 C95,74.85 74.85,95 50,95 C25.15,95 5,74.85 5,50 C5,25.15 25.15,5 50,5 Z M50,15 C69.33,15 85,30.67 85,50 C85,69.33 69.33,85 50,85 C30.67,85 15,69.33 15,50 C15,30.67 30.67,15 50,15 Z" }),
        React.createElement('text', { x: "32", y: "60", fontFamily: "sans-serif", fontSize: "24", fill: "white" }, "CL")
    )
);