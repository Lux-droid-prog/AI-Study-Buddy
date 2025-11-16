
export enum Page {
    Dashboard = 'dashboard',
    Projects = 'projects',
    Collaboration = 'collaboration',
    Team = 'team',
    Timeline = 'timeline',
    LearningHub = 'learning-hub',
    Presentations = 'presentations',
    Achievements = 'achievements',
}

export interface Project {
    id: number;
    name: string;
    description: string;
    start: string;
    end: string;
    score: number;
}

export interface Task {
    id: number;
    projectId: number;
    title: string;
    assignee: string;
    status: 'Todo' | 'In progress' | 'Done';
    due: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    course: string;
    major: string;
}

export interface Mood {
    member: string;
    mood: string;
    energy: number;
    note: string;
}

export interface SkillProfile {
    strengths: string[];
    role: string;
}

export interface Achievement {
    badge: string;
    owner: string;
}

export interface ChatMessage {
    sender: 'user' | 'ai' | 'system';
    text: string;
    scope?: 'group' | 'individual';
}

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

export interface Quiz {
    title: string;
    questions: QuizQuestion[];
}

export enum ExplanationStyle {
    ELI5 = 'eli5',
    PROFESSOR = 'professor',
    MEME = 'meme',
    STORY = 'story'
}

export interface PresentationSlide {
    title: string;
    content: string[];
}