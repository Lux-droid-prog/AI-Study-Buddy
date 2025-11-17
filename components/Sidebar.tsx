import React from 'react';
import { Page } from '../types';
import { 
    HomeIcon, GroupIcon, FileTextIcon, TimelineIcon, 
    BrainCircuitIcon, PresentationIcon, AwardIcon, LogOutIcon, Logo, UserIcon, TrendingUpIcon, TimerIcon, WhiteboardIcon
} from '../constants';

interface SidebarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}

const NavItem: React.FC<{
    icon: React.ElementType;
    label: string;
    page: Page;
    currentPage: Page;
    onNavigate: (page: Page) => void;
}> = ({ icon: Icon, label, page, currentPage, onNavigate }) => {
    const isActive = currentPage === page;
    return (
        <button
            onClick={() => onNavigate(page)}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
        >
            <Icon className="w-5 h-5 mr-3" />
            <span>{label}</span>
        </button>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout }) => {
    const navItems = [
        { icon: HomeIcon, label: 'Dashboard', page: Page.Dashboard },
        { icon: GroupIcon, label: 'Projects', page: Page.Projects },
        { icon: FileTextIcon, label: 'Collaboration', page: Page.Collaboration },
        { icon: UserIcon, label: 'Team', page: Page.Team },
        { icon: TimelineIcon, label: 'Timeline', page: Page.Timeline },
        { icon: BrainCircuitIcon, label: 'Learning Hub', page: Page.LearningHub },
        { icon: PresentationIcon, label: 'Presentations', page: Page.Presentations },
        { icon: AwardIcon, label: 'Achievements', page: Page.Achievements },
        { icon: TrendingUpIcon, label: 'Performance', page: Page.Performance },
        { icon: TimerIcon, label: 'Focus Mode', page: Page.FocusMode },
        { icon: WhiteboardIcon, label: 'Whiteboard', page: Page.Whiteboard },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col justify-between">
            <div>
                <div className="flex items-center mb-8 px-2">
                    <Logo className="h-10 w-10 mr-2" />
                    <h1 className="text-xl font-bold text-white">CollabLearn</h1>
                </div>
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <NavItem key={item.page} {...item} currentPage={currentPage} onNavigate={onNavigate} />
                    ))}
                </nav>
            </div>
            <div>
                <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-colors duration-200"
                >
                    <LogOutIcon className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};