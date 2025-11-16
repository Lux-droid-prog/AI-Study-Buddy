
import React from 'react';
import { Achievement, Project } from '../types';

interface AchievementsProps {
    achievements: Achievement[];
    projects: Project[];
}

export const Achievements: React.FC<AchievementsProps> = ({ achievements, projects }) => {
    const leaderboard = [...projects].sort((a, b) => b.score - a.score);

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Achievements</h1>
            
            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Team Achievements & Badges</h2>
                <div className="flex flex-wrap gap-4">
                    {achievements.map((ach, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded-lg flex flex-col items-center w-40">
                            <span className="text-4xl mb-2">🏅</span>
                            <p className="font-bold text-center">{ach.badge}</p>
                            <p className="text-sm text-gray-400">{ach.owner}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Project Leaderboard</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-3 text-sm font-semibold text-gray-400">Rank</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Project</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((project, index) => (
                                <tr key={project.id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700/50">
                                    <td className="p-3 font-bold text-lg">{index + 1}</td>
                                    <td className="p-3">{project.name}</td>
                                    <td className="p-3 text-blue-400 font-semibold">{project.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
