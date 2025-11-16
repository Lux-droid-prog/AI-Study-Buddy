
import React from 'react';
import { Logo } from '../constants';

interface LoginProps {
    onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
                    <div className="flex flex-col items-center mb-6">
                        <Logo className="h-16 w-16 mb-4" />
                        <h1 className="text-3xl font-bold text-white">Welcome to CollabLearn</h1>
                        <p className="text-gray-400 mt-2">Your AI-Powered Collaboration Hub</p>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    defaultValue="demo@collablearn.ai"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    defaultValue="password"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
                        >
                            Enter Platform
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
